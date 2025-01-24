'use client'

import { useState } from 'react'
import { extractTrackDetails, mapEmotionToSong } from './utils/songs'
import Image from 'next/image'

export default function Home() {
  const [entry, setEntry] = useState('')
  const [artist, setArtist] = useState('')
  const [song, setSong] = useState('')
  const [image, setImage] = useState('')
  const [link, setLink] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setArtist('')
    setSong('')
    setImage('')
    setLink('')

    try {
      // sentiment analysis
      if (entry.length == 0) {
        throw new Error('Please write a valid input');
      }
      const response = await fetch('/api/classify-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: entry }), 
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment analysis');
      }

      // this contains the max subemotion from our analyzed text
      const sentiment = await response.json();
      console.log(sentiment)

      // calls our function that assigns a song to a subemotion
      const song = mapEmotionToSong(sentiment.highestEmotion)
      console.log(song)

      // the suggested song as an object called from the spotify API
      const sug = await fetch(`/api/spotify/tracks/${song.id}`, {
        method: "GET",
      });
      
      if (!sug.ok) {
        throw new Error(`Error fetching track: ${sug.statusText}`);
      }
  
      const trackData = await sug.json();
      console.log("Track Data:", trackData);

      const trackDetails = extractTrackDetails(trackData)
      
      setArtist(trackDetails.artistName)
      setSong(trackDetails.trackName)
      setImage(trackDetails.imageUrl)
      setLink(trackDetails.spotifyLink)
  
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Tell me about you day! How are you feeling?</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          placeholder="Write about your day or an experience..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          style={{ width: '100%', height: '150px', padding: '10px', marginBottom: '10px' }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            backgroundColor: isLoading ? '#cccccc' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: isLoading ? 'not-allowed' : 'pointer' 
          }}
        >
          {isLoading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {artist != '' && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Your suggested song from Karen!</h2>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <div style={{ border: 'solid black'}}>
              <Image
              src={image}
              width={250}
              height={250}
              alt="Song's Image"
              />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '10px', marginBottom: '5px' }}>{song}</h2>
              <i><h2 style={{ fontSize: '18px', marginBottom: '10px' }}>By: {artist}</h2></i>
            </div>
          </a>
        </div>
      )}
    </main>
  )
}