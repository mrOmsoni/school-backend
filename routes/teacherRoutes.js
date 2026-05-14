import express from 'express'
import {
  createTeacher, getAllTeachers, updateTeacher, deleteTeacher,
  getTeacherAttendance, getAllAttendance,
  teacherLogin, getTeacherMe,
  markAttendance, getMyAttendance, saveFaceDescriptor,
  uploadMaterial, getMyMaterials, deleteMaterial,
  changeTeacherPassword
} from '../controllers/teacherController.js'
import protect from '../middleware/authMiddleware.js'
import protectTeacher from '../middleware/teacherMiddleware.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

// ── Auth ──────────────────────────────────────────────────
router.post('/login',          teacherLogin)
router.get('/me',              protectTeacher, getTeacherMe)
router.put('/change-password', protectTeacher, changeTeacherPassword)

// ── Attendance ────────────────────────────────────────────
router.post('/attendance/mark', protectTeacher, markAttendance)
router.get('/attendance/my',    protectTeacher, getMyAttendance)
router.get('/attendance/all',   protect,        getAllAttendance)

// ── Face ──────────────────────────────────────────────────
router.post('/face/save', protectTeacher, saveFaceDescriptor)

// ── Materials ─────────────────────────────────────────────
router.post('/materials',       protectTeacher, upload.single('file'), uploadMaterial)
router.get('/materials/my',     protectTeacher, getMyMaterials)
router.delete('/materials/:id', protectTeacher, deleteMaterial)

// ── Admin routes — LAST mein kyunki /:id sab match karta hai
router.get('/',    protect, getAllTeachers)
router.post('/',   protect, createTeacher)

router.get('/:id/attendance', protect, getTeacherAttendance)
router.put('/:id',    protect, updateTeacher)
router.delete('/:id', protect, deleteTeacher)

export default router