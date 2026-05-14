import Teacher from '../models/Teacher.js'
import Attendance from '../models/Attendance.js'
import Material from '../models/Material.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const generateTeacherToken = (id) => {
  return jwt.sign({ id, role: 'teacher' }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  })
}

export const createTeacher = async (req, res) => {
  try {
    const { name, email, password, phone, subject, qualification } = req.body
    if (!name || !email || !password || !subject)
      return errorResponse(res, 'Name, email, password and subject required', 400)
    const existing = await Teacher.findOne({ email })
    if (existing)
      return errorResponse(res, 'Teacher with this email already exists', 400)
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    const teacher = await Teacher.create({ name, email, phone, subject, qualification, password: hashedPassword })
    successResponse(res, { _id: teacher._id, name: teacher.name, email: teacher.email, subject: teacher.subject }, 'Teacher created', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password -faceDescriptor').sort({ createdAt: -1 })
    successResponse(res, teachers, 'Teachers fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const updateTeacher = async (req, res) => {
  try {
    const { password, ...rest } = req.body
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, rest, { new: true }).select('-password')
    if (!teacher) return errorResponse(res, 'Teacher not found', 404)
    successResponse(res, teacher, 'Teacher updated')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id)
    successResponse(res, null, 'Teacher deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getTeacherAttendance = async (req, res) => {
  try {
    const { month } = req.query
    const query = { teacher: req.params.id }
    if (month) query.month = month
    const attendance = await Attendance.find(query).sort({ date: -1 })
    const presentCount = attendance.filter(a => a.status === 'present').length
    successResponse(res, { attendance, presentCount, total: attendance.length }, 'Attendance fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getAllAttendance = async (req, res) => {
  try {
    const { month } = req.query
    const query = {}
    if (month) query.month = month
    const attendance = await Attendance.find(query)
      .populate('teacher', 'name subject photoUrl')
      .sort({ date: -1 })
    const grouped = {}
    attendance.forEach(a => {
      const tid = a.teacher._id.toString()
      if (!grouped[tid]) {
        grouped[tid] = { teacher: a.teacher, present: 0, absent: 0, records: [] }
      }
      if (a.status === 'present') grouped[tid].present++
      else grouped[tid].absent++
      grouped[tid].records.push(a)
    })
    successResponse(res, Object.values(grouped), 'All attendance fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const teacherLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return errorResponse(res, 'Email and password required', 400)
    const teacher = await Teacher.findOne({ email })
    if (!teacher)
      return errorResponse(res, 'Invalid email or password', 401)
    if (!teacher.isActive)
      return errorResponse(res, 'Your account has been deactivated', 403)
    const isMatch = await bcrypt.compare(password, teacher.password)
    if (!isMatch)
      return errorResponse(res, 'Invalid email or password', 401)
    const token = generateTeacherToken(teacher._id)
    successResponse(res, { token, name: teacher.name, email: teacher.email, subject: teacher.subject, photoUrl: teacher.photoUrl }, 'Login successful')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getTeacherMe = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacherId).select('-password')
    successResponse(res, teacher, 'Teacher fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const markAttendance = async (req, res) => {
  try {
    const today = new Date()
    const date  = today.toISOString().split('T')[0]
    const month = date.substring(0, 7)
    const existing = await Attendance.findOne({ teacher: req.teacherId, date })
    if (existing)
      return errorResponse(res, 'Attendance already marked for today', 400)
    const attendance = await Attendance.create({
      teacher: req.teacherId, date, month, status: 'present', method: req.body.method || 'face',
    })
    successResponse(res, attendance, 'Attendance marked successfully', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getMyAttendance = async (req, res) => {
  try {
    const { month } = req.query
    const query = { teacher: req.teacherId }
    if (month) query.month = month
    const attendance = await Attendance.find(query).sort({ date: -1 })
    const presentCount = attendance.filter(a => a.status === 'present').length
    successResponse(res, { attendance, presentCount, total: attendance.length }, 'Attendance fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const saveFaceDescriptor = async (req, res) => {
  try {
    const { descriptor } = req.body
    if (!descriptor || !Array.isArray(descriptor))
      return errorResponse(res, 'Face descriptor required', 400)
    await Teacher.findByIdAndUpdate(req.teacherId, { faceDescriptor: descriptor })
    successResponse(res, null, 'Face registered successfully')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, subject, class: cls } = req.body
    if (!title || !subject)
      return errorResponse(res, 'Title and subject required', 400)
    let fileUrl = req.body.fileUrl || ''
    let publicId = ''
    if (req.file) {
      fileUrl  = req.file.path
      publicId = req.file.filename
    }
    if (!fileUrl)
      return errorResponse(res, 'File or URL required', 400)
    const teacher = await Teacher.findById(req.teacherId)
    const material = await Material.create({
      teacher: req.teacherId, title, description, fileUrl, publicId,
      subject: subject || teacher.subject, class: cls || '', fileType: req.body.fileType || 'pdf',
    })
    successResponse(res, material, 'Material uploaded', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getMyMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ teacher: req.teacherId }).sort({ createdAt: -1 })
    successResponse(res, materials, 'Materials fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const deleteMaterial = async (req, res) => {
  try {
    await Material.findOneAndDelete({ _id: req.params.id, teacher: req.teacherId })
    successResponse(res, null, 'Material deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const changeTeacherPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return errorResponse(res, 'Both fields required', 400)
    const teacher = await Teacher.findById(req.teacherId)
    const isMatch = await bcrypt.compare(currentPassword, teacher.password)
    if (!isMatch)
      return errorResponse(res, 'Current password incorrect', 401)
    const salt = await bcrypt.genSalt(12)
    teacher.password = await bcrypt.hash(newPassword, salt)
    await teacher.save()
    successResponse(res, null, 'Password changed')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}