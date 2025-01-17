'use client'

import { useState } from 'react'

export default function Home() {
  const [entry, setEntry] = useState('')
//   const [sentiment, setSentiment] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    // setSentiment(null)
    setRecommendations([])

    try {
      // sentiment analysis
      if (entry.length == 0) {
        throw new Error('Please write a valid input');
      }
      let response = await fetch('/api/classify-mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: entry }), // Send the user's entry
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch sentiment analysis');
      }
  
      const scores = await response.json();
      console.log(scores)


    //   setSentiment(sentimentScore);
      
      response = await fetch("/api/spotify/top", {
        method: "GET",
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching seeds: ${response.statusText}`);
      }
  
      const seeds = await response.json();
      console.log(seeds)

      console.log(JSON.stringify({
        scores,     
        seeds       
      }))


      response = await fetch('/api/spotify/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores,     
          seeds       
        }), 
      });
      
      const result = await response.json();

      console.log(result)

    //   // get seeds 
    //   // get the songs 
    //   response = await fetch("/api/spotify/recommendations", {
    //     method: "GET",
    //   });
  
    //   if (!response.ok) {
    //     throw new Error("Failed to fetch recommendations");
    //   }
  
    //   const data = await response.json();
    //   console.log(data.tracks); // Handle track data as needed
    //   return data.tracks;

      // Simulate song recommendations (replace with actual API call)

    //   const getSongRecommendations = (score: number) => {
    //     const happySongs = ['Happy - Pharrell Williams', 'Good Vibrations - The Beach Boys', 'Dancing Queen - ABBA']
    //     const sadSongs = ['Someone Like You - Adele', 'Hurt - Johnny Cash', 'The Sound of Silence - Simon & Garfunkel']
    //     return score > 0 ? happySongs : sadSongs
    //   }
    //   const recommendedSongs = getSongRecommendations(sentimentScore)
    //   setRecommendations(recommendedSongs)
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
      {/* {sentiment !== null && (
        <div style={{ marginTop: '20px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>Sentiment Analysis</h2>
          <p>Your mood seems to be: {sentiment > 0 ? 'Positive' : 'Negative'} ({sentiment.toFixed(2)})</p>
        </div>
      )} */}
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