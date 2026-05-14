import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date:        { type: Date,   required: true },
  category:    { type: String, enum: ['Academic','Sports','Cultural','Holiday','Other'], default: 'Academic' },
  location:    { type: String, default: '' },
  imageUrl:    { type: String, default: '' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)