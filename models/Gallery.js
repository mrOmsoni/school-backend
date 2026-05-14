import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
  imageUrl:  { type: String, required: true },
  publicId:  { type: String, default: '' },
  caption:   { type: String, default: '' },
  category:  { type: String, enum: ['Events','Sports','Cultural','Classroom','Campus'], default: 'Events' },
}, { timestamps: true })

export default mongoose.model('Gallery', gallerySchema)