import mongoose from 'mongoose'

const querySchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  phone:      { type: String, default: '' },
  subject:    { type: String, required: true },
  message:    { type: String, required: true },
  status:     { type: String, enum: ['pending','replied'], default: 'pending' },
  adminReply: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Query', querySchema)