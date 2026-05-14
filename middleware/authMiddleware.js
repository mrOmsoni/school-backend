import jwt from 'jsonwebtoken'
import { errorResponse } from '../utils/apiResponse.js'

const protect = async (req, res, next) => {
  try {
    let token

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token)
      return errorResponse(res, 'Not authorized — no token', 401)

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.adminId = decoded.id
    next()
  } catch (err) {
    return errorResponse(res, 'Not authorized — invalid token', 401)
  }
}

export default protect