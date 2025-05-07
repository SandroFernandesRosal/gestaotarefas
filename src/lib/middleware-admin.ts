import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export async function authMiddleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    return decoded as { sub: string }
  } catch {
    return null
  }
}