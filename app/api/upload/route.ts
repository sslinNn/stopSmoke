import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('avatar') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 })
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Неверный формат файла' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = `${session.user.email}-${Date.now()}${path.extname(file.name)}`
    const filepath = path.join(process.cwd(), 'public/avatars', filename)

    await writeFile(filepath, buffer)

    // Обновляем ссылку на аватар в базе данных
    await prisma.user.update({
      where: { email: session.user.email },
      data: { avatar: `/avatars/${filename}` }
    })

    return NextResponse.json({ 
      success: true, 
      avatar: `/avatars/${filename}` 
    })
  } catch (error) {
    console.error('Ошибка загрузки:', error)
    return NextResponse.json({ error: 'Ошибка загрузки файла' }, { status: 500 })
  }
} 