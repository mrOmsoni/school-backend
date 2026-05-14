import mongoose from 'mongoose'

const materialSchema = new mongoose.Schema({
  teacher:     { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  title:       { type: String, required: true },
  description: { type: String, default: '' },
  fileUrl:     { type: String, required: true },
  publicId:    { type: String, default: '' },
  fileType:    { type: String, default: 'pdf' }, // pdf, doc, image, video
  subject:     { type: String, required: true },
  class:       { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Material', materialSchema)