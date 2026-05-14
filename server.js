import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import teacherRoutes from './routes/teacherRoutes.js'

// Routes
import authRoutes    from './routes/authRoutes.js'
import eventRoutes   from './routes/eventRoutes.js'
import noticeRoutes  from './routes/noticeRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import queryRoutes   from './routes/queryRoutes.js'

// Config
dotenv.config()
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/teachers', teacherRoutes)

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Sun Shine Smart School API is running' })
})

// API Routes
app.use('/api/auth',    authRoutes)
app.use('/api/events',  eventRoutes)
app.use('/api/notices', noticeRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/queries', queryRoutes)

// Error Handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})