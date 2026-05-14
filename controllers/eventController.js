import Event from '../models/Event.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @GET /api/events
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: -1 })
    successResponse(res, events, 'Events fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @GET /api/events/all  (admin — inactive bhi)
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 })
    successResponse(res, events, 'All events fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, category, location, imageUrl } = req.body
    if (!title || !description || !date)
      return errorResponse(res, 'Title, description and date required', 400)

    const event = await Event.create({ title, description, date, category, location, imageUrl })
    successResponse(res, event, 'Event created', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!event) return errorResponse(res, 'Event not found', 404)
    successResponse(res, event, 'Event updated')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return errorResponse(res, 'Event not found', 404)
    successResponse(res, null, 'Event deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}