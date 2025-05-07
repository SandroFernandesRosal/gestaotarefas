// pages/api/tasks/create.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { authMiddleware } from '@/lib/middleware-admin'



export async function GET() {
    try {
      const tasks = await prisma.task.findMany()
  
      return NextResponse.json(tasks)
    } catch (error) {
      console.error('Erro ao listar administradores:', error)
      return NextResponse.json(
        { error: 'Erro ao listar administradores' },
        { status: 500 },
      )
    }
  }

export async function POST(req: NextRequest) {
  const user = await authMiddleware(req)
  if (!user)
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const body = await req.json()

  const schema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED'],),
  })

  const data = schema.parse(body)

  const task = await prisma.task.create({
    data: {
        ...data,
      userId: user.sub,
      title: data.title,
      description: data.description,
      status: data.status,
      
    },
  })

  return NextResponse.json(task)
}
