import mongoose from 'mongoose'

const noticeSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  content:    { type: String, required: true },
  priority:   { type: String, enum: ['high','medium','low'], default: 'medium' },
  isActive:   { type: Boolean, default: true },
  expiryDate: { type: Date },
}, { timestamps: true })

export default mongoose.model('Notice', noticeSchema)