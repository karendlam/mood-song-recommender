// Define the mapping between emotions and songs
const emotionToSongMap: Record<string, { title: string; artist: string; id: string }> = {
    joy: { title: "Beaches", artist: "Beabadoobee", id: "1a19jsjG2DvbN1fVJonKUU" },
    // gratitude: { title: "Clouds", artist: "Any Name's Okay", id: "4xy6P7NgxEzaai4WUlVDsB" },
    nostalgia: { title: "Running", artist: "No Doubt", id: "3GsbGZHKjSk4PLr3HXfcoo" },
    depression: { title: "Everytime", artist: "Britney Spears", id: "0dRhSF9LV0HR8Jwd3MMMKJ" },
    yearning: { title: "When I'm Thinking About You", artist: "The Sundays", id: "2RtOnuOdBiecnBoX8x9uoO" },
    frustration: { title: "All Falls Down", artist: "Lizzy McAlpine", id: "46kXlOq68HXFrhkxGV6qtI" },
    resentment: { title: "Decode", artist: "Paramore", id: "1ZLtE9tSJdaUiIJ9YoKHQe" },
    disgust: { title: "Hold Up", artist: "Beyonce`", id: "0rzNMzZsubFcXSEh7dnem7" },
    shock: { title: "Ghost in the Machine (feat. Phoebe Bridgers)", artist: "SZA, Phoebe Bridgers", id: "4h5x3XHLVYFJaItKuO2rhy" },
    awe: { title: "Kokomo, IN", artist: "Japanese Breakfast", id: "0O4sIQ728ugLlwBVaxF8UM" },
    anxiety: { title: "Too Good to be True", artist: "Kacey Musgraves", id: "27RDQ0TfxzWMlQFuKrPT11" },
    // insecurity: { title: "Unpretty", artist: "TLC", id: "0BUoLE4o9eVahDHvTqak67" },
    // envy: { title: "jealousy, jealousy", artist: "Olivia Rodrigo", id: "0MMyJUC3WNnFS1lit5pTjk" },
    love: { title: "Can't Take My Eyes Off of You - (I Love You Baby)", artist: "Ms. Lauryn Hill", id: "2GFExyKXf9383tSRSrEHEt" }
  };
  
  // Function to find the highest scoring emotion and map it to a song id 
  export function mapEmotionToSong(emotion: string): { title: string, artist: string, id: string} {
    // Return the corresponding song's id for the highest scoring emotion
    return emotionToSongMap[emotion] || { title: "Clouds", artist: "Any Name's Okay" , id: "4xy6P7NgxEzaai4WUlVDsB"};
  }

  // function that's used when we get track data from spotify (a json)
  export function extractTrackDetails(trackData: any) {
    const spotifyLink = trackData.external_urls?.spotify || "No link available";
    const imageUrl =
      trackData.album?.images?.length > 0 ? trackData.album.images[0].url : "No image available";
    const trackName = trackData.name || "No track name available";
    const artistName =
      trackData.artists?.length > 0 ? trackData.artists.map((artist: any) => artist.name).join(", ") : "No artist name available";
  
    return {
      spotifyLink,
      imageUrl,
      trackName,
      artistName,
    };
  }

