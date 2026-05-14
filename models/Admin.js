import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
  name:         { type: String, default: 'Admin' },
  email:        { type: String, required: true, unique: true, lowercase: true },
  password:     { type: String, required: true, minlength: 6 },
  resetToken:   { type: String },
  resetExpire:  { type: Date },
}, { timestamps: true })

adminSchema.methods.comparePassword = async function (enteredPassword) {
  const bcrypt = await import('bcryptjs')
  return await bcrypt.default.compare(enteredPassword, this.password)
}

const Admin = mongoose.model('Admin', adminSchema)
export default Admin