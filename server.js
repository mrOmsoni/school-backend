import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes    from './routes/authRoutes.js'
import eventRoutes   from './routes/eventRoutes.js'
import noticeRoutes  from './routes/noticeRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import queryRoutes   from './routes/queryRoutes.js'
import teacherRoutes from './routes/teacherRoutes.js'

dotenv.config()
connectDB()

const app = express()

app.use(cors({
  origin: [
    'https://school-frontend-plum-ten.vercel.app',
    'https://school-frontend-ma8s7x37r-om-sonis-projects-5a1c5a99.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.json({ message: 'Sun Shine Smart School API is running' })
})

app.use('/api/auth',     authRoutes)
app.use('/api/events',   eventRoutes)
app.use('/api/notices',  noticeRoutes)
app.use('/api/gallery',  galleryRoutes)
app.use('/api/queries',  queryRoutes)
app.use('/api/teachers', teacherRoutes)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
