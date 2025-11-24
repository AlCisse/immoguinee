import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Créer une réponse avec le cookie
    const response = NextResponse.json({ success: true })

    // Définir le cookie dans la réponse
    response.cookies.set('auth_token', token, {
      httpOnly: false, // Doit être accessible côté client pour les requêtes API
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return response
  } catch (error) {
    console.error('❌ Error setting token:', error)
    return NextResponse.json({ error: 'Failed to set token' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Créer une réponse avec suppression du cookie
    const response = NextResponse.json({ success: true })

    // Supprimer le cookie en définissant maxAge à 0
    response.cookies.set('auth_token', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('❌ Error deleting token:', error)
    return NextResponse.json({ error: 'Failed to delete token' }, { status: 500 })
  }
}
