# YouTube Shorts Uploader

A web application to upload YouTube Shorts directly from your browser.

## Setup Instructions

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**

### 2. OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Add authorized redirect URIs
4. Save your Client ID and Client Secret

### 3. Deploy to Vercel

Add environment variables:
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REFRESH_TOKEN

## Features

- Drag and drop video upload
- Video preview
- Direct YouTube API integration
- Secure OAuth authentication
