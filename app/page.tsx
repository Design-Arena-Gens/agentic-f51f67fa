'use client'

import { useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create video preview
      const url = URL.createObjectURL(selectedFile)
      setVideoPreview(url)

      // Auto-fill title from filename if empty
      if (!title) {
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, '')
        setTitle(fileName)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      setMessage('Please select a video file')
      return
    }

    setUploading(true)
    setMessage('Uploading...')

    const formData = new FormData()
    formData.append('video', file)
    formData.append('title', title)
    formData.append('description', description)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Success! Video uploaded: ${data.videoUrl}`)
        setFile(null)
        setTitle('')
        setDescription('')
        setVideoPreview(null)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>YouTube Shorts Uploader</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.uploadArea}>
            <label htmlFor="video-upload" className={styles.uploadLabel}>
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className={styles.videoPreview}
                  controls
                />
              ) : (
                <>
                  <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Click to upload video or drag and drop</span>
                  <span className={styles.uploadHint}>MP4, MOV, AVI (max 60s for Shorts)</span>
                </>
              )}
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
          </div>

          {file && (
            <div className={styles.fileInfo}>
              <p>Selected: {file.name}</p>
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className={styles.input}
              placeholder="Enter video title"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={5000}
              className={styles.textarea}
              placeholder="Enter video description (optional)"
            />
          </div>

          <button
            type="submit"
            disabled={uploading || !file || !title}
            className={styles.submitButton}
          >
            {uploading ? 'Uploading...' : 'Upload to YouTube'}
          </button>
        </form>

        {message && (
          <div className={message.includes('Success') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}

        <div className={styles.instructions}>
          <h2>Setup Instructions</h2>
          <ol>
            <li>Create a Google Cloud Project and enable YouTube Data API v3</li>
            <li>Create OAuth 2.0 credentials (Web application)</li>
            <li>Add your credentials to environment variables</li>
            <li>Authorize the app to access your YouTube channel</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
