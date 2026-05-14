import express from 'express'
import {
  getGallery,
  uploadImage,
  deleteImage
} from '../controllers/galleryController.js'
import protect from '../middleware/authMiddleware.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

router.get('/',       getGallery)                          // public
router.post('/',      protect, upload.single('image'), uploadImage)  // admin
router.delete('/:id', protect, deleteImage)                // admin

export default router