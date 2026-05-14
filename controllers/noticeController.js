import Notice from '../models/Notice.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @GET /api/notices  (public — active only)
export const getNotices = async (req, res) => {
  try {
    const now = new Date()
    const notices = await Notice.find({
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gte: now } }
      ]
    }).sort({ createdAt: -1 })
    successResponse(res, notices, 'Notices fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @GET /api/notices/all  (admin)
export const getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 })
    successResponse(res, notices, 'All notices fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @POST /api/notices
export const createNotice = async (req, res) => {
  try {
    const { title, content, priority, expiryDate } = req.body
    if (!title || !content)
      return errorResponse(res, 'Title and content required', 400)

    const notice = await Notice.create({ title, content, priority, expiryDate })
    successResponse(res, notice, 'Notice created', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @PUT /api/notices/:id
export const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!notice) return errorResponse(res, 'Notice not found', 404)
    successResponse(res, notice, 'Notice updated')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @DELETE /api/notices/:id
export const deleteNotice = async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id)
    successResponse(res, null, 'Notice deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}