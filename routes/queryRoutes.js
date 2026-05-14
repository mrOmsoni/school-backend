import express from 'express'
import {
  submitQuery,
  getQueries,
  replyToQuery,
  deleteQuery
} from '../controllers/queryController.js'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/',           submitQuery)             // public
router.get('/',            protect, getQueries)     // admin
router.put('/:id/reply',   protect, replyToQuery)   // admin
router.delete('/:id',      protect, deleteQuery)    // admin

export default router