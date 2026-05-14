import express from 'express'
import {
  login,
  setupAdmin,
  getMe,
  changePassword,
  forgotPassword,
  resetPassword,
  updateProfile
} from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/login',                 login)
router.post('/setup',                 setupAdmin)
router.get('/me',                     protect, getMe)
router.put('/change-password',        protect, changePassword)
router.put('/update-profile',         protect, updateProfile)
router.post('/forgot-password',       forgotPassword)
router.post('/reset-password/:token', resetPassword)

export default router