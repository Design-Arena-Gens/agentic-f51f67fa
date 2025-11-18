import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 })
  }

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

  try {
    const { tokens } = await oauth2Client.getToken(code)

    return NextResponse.json({
      success: true,
      message: 'Authorization successful! Save this refresh token to your environment variables:',
      refreshToken: tokens.refresh_token,
      instructions: 'Add this to your .env.local file as GOOGLE_REFRESH_TOKEN'
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to exchange authorization code',
      details: error.message
    }, { status: 500 })
  }
}
