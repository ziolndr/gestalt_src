import { NextResponse } from 'next/server'
import { Pool } from 'pg'
import bcrypt from 'bcrypt'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, position, agencyId } = body

    // Validate input (add more thorough validation as needed)
    if (!email || !password || !firstName || !lastName || !position || !agencyId) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Insert user into the database
    const result = await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, position, agency_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [email, hashedPassword, firstName, lastName, position, agencyId]
    )

    return NextResponse.json({ message: 'User created successfully', userId: result.rows[0].id }, { status: 201 })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 })
  }
}