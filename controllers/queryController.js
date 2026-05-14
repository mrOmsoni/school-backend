import Query from '../models/Query.js'
import sendEmail from '../utils/sendEmail.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

// @POST /api/queries  (public)
export const submitQuery = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body
    if (!name || !email || !subject || !message)
      return errorResponse(res, 'Name, email, subject and message required', 400)

    const query = await Query.create({ name, email, phone, subject, message })

    // User ko confirmation email
    try {
      await sendEmail({
        to: email,
        subject: 'We received your query — Sun Shine Smart School',
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
            <h2 style="color:#1a3c6e">Sun Shine Smart School Bargi</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for contacting us. We have received your query regarding <strong>${subject}</strong>.</p>
            <p>Our team will get back to you within 24 hours.</p>
            <hr/>
            <p><strong>Your Message:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px">${message}</p>
            <hr/>
            <p style="color:#888;font-size:12px">Sun Shine Smart School, Bargi, Sihora, Jabalpur</p>
          </div>
        `
      })
    } catch (emailErr) {
      console.log('Email send failed:', emailErr.message)
    }

    successResponse(res, query, 'Query submitted successfully', 201)
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @GET /api/queries  (admin only)
export const getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 })
    successResponse(res, queries, 'Queries fetched')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @PUT /api/queries/:id/reply  (admin only)
export const replyToQuery = async (req, res) => {
  try {
    const { reply } = req.body
    if (!reply) return errorResponse(res, 'Reply text required', 400)

    const query = await Query.findById(req.params.id)
    if (!query) return errorResponse(res, 'Query not found', 404)

    query.adminReply = reply
    query.status     = 'replied'
    await query.save()

    // User ko reply email bhejo
    try {
      await sendEmail({
        to: query.email,
        subject: `Reply to your query — ${query.subject}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
            <h2 style="color:#1a3c6e">Sun Shine Smart School Bargi</h2>
            <p>Dear <strong>${query.name}</strong>,</p>
            <p>We have replied to your query regarding <strong>${query.subject}</strong>.</p>
            <hr/>
            <p><strong>Your Query:</strong></p>
            <p style="background:#f5f5f5;padding:12px;border-radius:6px">${query.message}</p>
            <p><strong>Our Reply:</strong></p>
            <p style="background:#e8f4e8;padding:12px;border-radius:6px">${reply}</p>
            <hr/>
            <p style="color:#888;font-size:12px">Sun Shine Smart School, Bargi, Sihora, Jabalpur</p>
          </div>
        `
      })
    } catch (emailErr) {
      console.log('Reply email failed:', emailErr.message)
    }

    successResponse(res, query, 'Reply sent successfully')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}

// @DELETE /api/queries/:id  (admin only)
export const deleteQuery = async (req, res) => {
  try {
    await Query.findByIdAndDelete(req.params.id)
    successResponse(res, null, 'Query deleted')
  } catch (err) {
    errorResponse(res, err.message, 500)
  }
}