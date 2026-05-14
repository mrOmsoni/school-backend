import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/apiResponse.js'

const protectTeacher = async (req, res, next) => {
  try {
    let token
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }
    if (!token)
      return errorResponse(res, 'Not authorized', 401)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded.role !== 'teacher')
      return errorResponse(res, 'Not authorized as teacher', 401)

    req.teacherId = decoded.id
    next()
  } catch (err) {
    return errorResponse(res, 'Invalid token', 401)
  }
}

export default protectTeacher