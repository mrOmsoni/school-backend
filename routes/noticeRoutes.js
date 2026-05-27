import express from 'express'
import {
  getNotices,
  getAllNotices,
  createNotice,
  updateNotice,
  deleteNotice
} from '../controllers/noticeController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/',      getNotices)               // public
router.get('/all',   protect, getAllNotices)   // admin
router.post('/',     protect, createNotice)   // admin
router.put('/:id',   protect, updateNotice)   // admin
router.delete('/:id', protect, deleteNotice)  // admin

export default router