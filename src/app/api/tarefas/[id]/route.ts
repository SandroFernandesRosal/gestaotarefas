import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { authMiddleware } from '@/lib/middleware-admin'

const paramsSchema = z.object({
    id: z.string().uuid(),
  })

export async function GET(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const { id } = paramsSchema.parse(await params)
  
    const tasks = await prisma.task.findUniqueOrThrow({ where: { id } })
    return NextResponse.json(tasks)
  }

  export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const user = await authMiddleware(req)
    if (!user)
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
    const { id } = paramsSchema.parse(await params)
    const body = await req.json()
  
    const schema = z.object({
      description: z.string(),
      title: z.string(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
      
    })
  
    const data = schema.parse(body)
  
    
  
    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        userId: user.sub,
        
      },
    })
  
    return NextResponse.json(updated)
  }
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) {
    const user = await authMiddleware(req)
    if (!user)
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
    const { id } = paramsSchema.parse(await params)
  
    await prisma.task.delete({ where: { id } })
  
    return NextResponse.json({ message: 'Deletado com sucesso' })
  }