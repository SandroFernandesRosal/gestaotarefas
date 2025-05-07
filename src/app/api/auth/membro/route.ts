import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcrypt'



export async function GET() {
    try {
      const admins = await prisma.userAdmin.findMany()
  
      return NextResponse.json(admins)
    } catch (error) {
      console.error('Erro ao listar administradores:', error)
      return NextResponse.json(
        { error: 'Erro ao listar administradores' },
        { status: 500 },
      )
    }
  }

export async function POST(req: Request) {
    const userSchema = z.object({
      email: z.string().email({ message: 'Email inválido' }),
      name: z.string(),
      password: z
        .string()
        .min(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
        .max(10, { message: 'A senha deve ter no máximo 10 caracteres' })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
          message: 'A senha deve conter pelo menos um caractere especial',
        })
        .refine((value) => /[a-zA-Z]/.test(value), {
          message: 'A senha deve conter pelo menos uma letra',
        }),
      
    })
  
    try {
      const { email, name, password } = userSchema.parse(
        await req.json(),
      )
  
      const existingUser = await prisma.userAdmin.findUnique({
        where: { email },
      })
  
      if (existingUser) {
        return NextResponse.json(
          { error: `Usuário ${email} já existe.` },
          { status: 400 },
        )
      }
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const user = await prisma.userAdmin.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      })
  
      return NextResponse.json({ user })
    } catch {
      return NextResponse.json(
        { error: 'Erro ao registrar usuário' },
        { status: 500 },
      )
    }
  }