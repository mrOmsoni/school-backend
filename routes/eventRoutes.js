import express from 'express'
import {
  getEvents,
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/',      getEvents)               // public
router.get('/all',   protect, getAllEvents)   // admin
router.post('/',     protect, createEvent)   // admin
router.put('/:id',   protect, updateEvent)   // admin
router.delete('/:id', protect, deleteEvent)  // admin

export default router