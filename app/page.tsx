'use client'

import { useState } from 'react'

export default function Home() {
  const [entry, setEntry] = useState('')
  const [sentiment, setSentiment] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSentiment(null)
    setRecommendations([])

    try {
      // Simulate sentiment analysis (replace with actual API call)
      const analyzeSentiment = () => Math.random() * 2 - 1 // Random number between -1 and 1
      const sentimentScore = analyzeSentiment()
      setSentiment(sentimentScore)

      // Simulate song recommendations (replace with actual API call)
      const getSongRecommendations = (score: number) => {
        const happySongs = ['Happy - Pharrell Williams', 'Good Vibrations - The Beach Boys', 'Dancing Queen - ABBA']
        const sadSongs = ['Someone Like You - Adele', 'Hurt - Johnny Cash', 'The Sound of Silence - Simon & Garfunkel']
        return score > 0 ? happySongs : sadSongs
      }
      const recommendedSongs = getSongRecommendations(sentimentScore)
      setRecommendations(recommendedSongs)
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>How are you feeling?</h1>
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
          {isLoading ? 'Analyzing...' : 'Analyze and Recommend'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      {sentiment !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Sentiment Analysis</h2>
          <p>Your mood seems to be: {sentiment > 0 ? 'Positive' : 'Negative'} ({sentiment.toFixed(2)})</p>
        </div>
      )}
      {recommendations.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Recommended Songs:</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {recommendations.map((song, index) => (
              <li key={index} style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '5px', borderRadius: '5px' }}>
                {song}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  )
}