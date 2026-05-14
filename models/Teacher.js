import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const teacherSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  phone:          { type: String, default: '' },
  subject:        { type: String, required: true },
  qualification:  { type: String, default: '' },
  photoUrl:       { type: String, default: '' },
  faceDescriptor: { type: [Number], default: [] }, // face recognition data
  isActive:       { type: Boolean, default: true },
  resetToken:     { type: String },
  resetExpire:    { type: Date },
}, { timestamps: true })

const Teacher = mongoose.model('Teacher', teacherSchema)
export default Teacher