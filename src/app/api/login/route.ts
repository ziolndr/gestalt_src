import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const trimmedEmail = email.trim().toLowerCase()
    console.log('Login attempt for email:', trimmedEmail)

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: trimmedEmail,
          mode: 'insensitive'
        }
      }
    })

    console.log('User lookup result:', user ? 'User found' : 'User not found')

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    console.log('Comparing passwords')
    const passwordMatch = await bcrypt.compare(password, user.password)
    console.log('Password match:', passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.firstName, 
        lastName: user.lastName 
      } 
    })
  } catch (error) {
    console.error('Login error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ message: 'Error logging in', error: errorMessage }, { status: 500 })
  }
}