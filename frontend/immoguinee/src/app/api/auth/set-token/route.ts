import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Définir le cookie côté serveur avec Next.js
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: false, // Doit être accessible côté client pour les requêtes API
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error setting token:', error)
    return NextResponse.json({ error: 'Failed to set token' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Supprimer le cookie côté serveur
    const cookieStore = await cookies()
    cookieStore.delete('auth_token')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting token:', error)
    return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 })
  }
}
