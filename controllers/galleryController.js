import Gallery from '../models/Gallery.js'
import cloudinary from '../config/cloudinary.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @GET /api/gallery
export const getGallery = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 })
    successResponse(res, images, 'Gallery fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @POST /api/gallery  (image upload)
export const uploadImage = async (req, res) => {
  try {
    const { caption, category, imageUrl } = req.body

    let finalImageUrl = imageUrl
    let publicId = ''

    // Agar file upload hua toh Cloudinary se URL lo
    if (req.file) {
      finalImageUrl = req.file.path
      publicId      = req.file.filename
    }

    if (!finalImageUrl)
      return errorResponse(res, 'Image URL or file required', 400)

    const image = await Gallery.create({
      imageUrl: finalImageUrl,
      publicId,
      caption:  caption || '',
      category: category || 'Events',
    })

    successResponse(res, image, 'Image uploaded', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @DELETE /api/gallery/:id
export const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id)
    if (!image) return errorResponse(res, 'Image not found', 404)

    // Cloudinary se bhi delete karo agar publicId hai
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId)
    }

    await Gallery.findByIdAndDelete(req.params.id)
    successResponse(res, null, 'Image deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}