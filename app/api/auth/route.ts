import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({
      error: 'Google OAuth credentials not configured'
    }, { status: 500 })
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/callback`
  )

  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
  ]

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  return NextResponse.redirect(url)
}
