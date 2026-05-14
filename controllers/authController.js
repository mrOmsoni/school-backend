import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Admin from '../models/Admin.js'
import sendEmail from '../utils/sendEmail.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return errorResponse(res, 'Email and password required', 400)
    const admin = await Admin.findOne({ email })
    if (!admin)
      return errorResponse(res, 'Invalid email or password', 401)
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch)
      return errorResponse(res, 'Invalid email or password', 401)
    const token = generateToken(admin._id)
    successResponse(res, { token, name: admin.name, email: admin.email }, 'Login successful')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const setupAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({})
    if (existing)
      return errorResponse(res, 'Admin already exists', 400)
    const { name, email, password } = req.body
    if (!email || !password)
      return errorResponse(res, 'Email and password required', 400)
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    const admin = await Admin.create({ name: name || 'Admin', email, password: hashedPassword })
    const token = generateToken(admin._id)
    successResponse(res, { token, email: admin.email }, 'Admin created', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password')
    successResponse(res, admin, 'Admin fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return errorResponse(res, 'Both fields required', 400)
    if (newPassword.length < 6)
      return errorResponse(res, 'Min 6 characters required', 400)
    const admin = await Admin.findById(req.adminId)
    const isMatch = await bcrypt.compare(currentPassword, admin.password)
    if (!isMatch)
      return errorResponse(res, 'Current password is incorrect', 401)
    const salt = await bcrypt.genSalt(12)
    admin.password = await bcrypt.hash(newPassword, salt)
    await admin.save()
    successResponse(res, null, 'Password changed successfully')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body
    const admin = await Admin.findByIdAndUpdate(
      req.adminId,
      { name, email },
      { new: true }
    ).select('-password')
    successResponse(res, admin, 'Profile updated')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const admin = await Admin.findOne({ email })
    if (!admin)
      return successResponse(res, null, 'If this email exists, reset link has been sent')
    const resetToken  = crypto.randomBytes(32).toString('hex')
    admin.resetToken  = resetToken
    admin.resetExpire = Date.now() + 30 * 60 * 1000
    await admin.save()
    const resetUrl = `${process.env.CLIENT_URL}/admin-reset-password/${resetToken}`
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset — Sun Shine Smart School',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
            <h2 style="color:#1a3c6e">Password Reset Request</h2>
            <p>Click below to reset your password. Link expires in 30 minutes.</p>
            <a href="${resetUrl}" style="display:inline-block;background:#1a3c6e;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0">
              Reset Password
            </a>
            <p style="color:#888;font-size:12px">If you did not request this, ignore this email.</p>
          </div>
        `
      })
    } catch (e) {
      console.log('Email failed:', e.message)
    }
    successResponse(res, null, 'Reset link sent to your email')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { newPassword } = req.body
    if (!newPassword || newPassword.length < 6)
      return errorResponse(res, 'Min 6 characters required', 400)
    const admin = await Admin.findOne({
      resetToken:  token,
      resetExpire: { $gt: Date.now() }
    })
    if (!admin)
      return errorResponse(res, 'Invalid or expired reset link', 400)
    const salt = await bcrypt.genSalt(12)
    admin.password    = await bcrypt.hash(newPassword, salt)
    admin.resetToken  = undefined
    admin.resetExpire = undefined
    await admin.save()
    successResponse(res, null, 'Password reset successful')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}