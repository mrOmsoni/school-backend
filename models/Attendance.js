import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  teacher:   { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  date:      { type: String, required: true }, // "2026-05-02"
  month:     { type: String, required: true }, // "2026-05"
  status:    { type: String, enum: ['present', 'absent'], default: 'present' },
  markedAt:  { type: Date, default: Date.now },
  method:    { type: String, enum: ['face', 'manual'], default: 'face' },
}, { timestamps: true })

// Ek teacher ek din mein sirf ek attendance
attendanceSchema.index({ teacher: 1, date: 1 }, { unique: true })

export default mongoose.model('Attendance', attendanceSchema)