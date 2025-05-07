import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { z } from 'zod'

async function authenticateUser(email: string, password: string) {
  const user = await prisma.userAdmin.findUnique({
    where: {
      email,
    },
  })

  if (!user) {
    return false
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  return isPasswordValid ? user : false
}

export async function POST(req: Request) {
  const userSchema = z.object({
    email: z.string(),
    password: z.string(),
  })

  try {
    const { email, password } = userSchema.parse(await req.json())

    const user = await authenticateUser(email, password)

    if (!user) {
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 },
      )
    }



    const token = jwt.sign(
      {
        name: user.name,
        
        email: user.email,
        id: user.id,
      },
      process.env.JWT_SECRET || 'secret',
      {
        subject: user.id.toString(),
        expiresIn: '30d',
      },
    )

    const response = NextResponse.json({ user, token })
    response.cookies.set('token', token, {
      
      sameSite: 'strict',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 dias
    })

    return response
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return NextResponse.json({ error: 'Erro na autenticação' }, { status: 500 })
  }
}