import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

const youtube = google.youtube('v3')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const video = formData.get('video') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (!video) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    // Check for OAuth credentials in environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json({
        error: 'YouTube API credentials not configured. Please set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.'
      }, { status: 500 })
    }

    // Set up OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'http://localhost:3000/api/auth/callback'
    )

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    })

    // Convert File to Buffer
    const arrayBuffer = await video.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload video to YouTube
    const response = await youtube.videos.insert({
      auth: oauth2Client,
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description: description || '',
          categoryId: '22', // People & Blogs category
          tags: ['shorts', 'short video'],
        },
        status: {
          privacyStatus: 'private', // Set to private by default for safety
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: buffer as any,
      },
    })

    const videoId = response.data.id
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`

    return NextResponse.json({
      success: true,
      videoId,
      videoUrl,
      message: 'Video uploaded successfully!',
    })
  } catch (error: any) {
    console.error('Upload error:', error)

    // Handle specific error cases
    if (error.message?.includes('credentials')) {
      return NextResponse.json({
        error: 'Authentication failed. Please check your YouTube API credentials.'
      }, { status: 401 })
    }

    return NextResponse.json({
      error: error.message || 'Failed to upload video'
    }, { status: 500 })
  }
}
