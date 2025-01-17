import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Define types for Spotify API responses
type Artist = {
  id: string;
  name: string;
  genres: string[];
};

type Track = {
  id: string;
  name: string;
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
  };
};

type TopItemsResponse<T> = {
  items: T[];
};

export async function GET(req: Request): Promise<NextResponse> {
  try {
    // Extract access token from cookies
    const accessToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith("access_token"))
      ?.split("=")[1];

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    // Define helper function to fetch top 5 items (artists or tracks)
    const fetchTopItems = async <T>(type: "artists" | "tracks"): Promise<TopItemsResponse<T>> => {
      const response = await fetch(`https://api.spotify.com/v1/me/top/${type}?limit=5`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch top ${type}: ${response.statusText}`);
      }

      return response.json();
    };

    // Helper function to prepare seeds for recommendations
    const prepareSeedsForRecommendations = (
      topArtists: TopItemsResponse<Artist>,
      topTracks: TopItemsResponse<Track>
    ) => {
      // Extract artist IDs
      const seedArtists = topArtists.items.map((artist) => artist.id);

      // Extract track IDs
      const seedTracks = topTracks.items.map((track) => track.id);

      // Extract genres from top artists
      const genres = new Set<string>();
      topArtists.items.forEach((artist) => {
        artist.genres.forEach((genre) => genres.add(genre));
      });

      // Randomize genres and limit to 5
      const shuffleArray = <T>(array: T[]): T[] =>
        array.sort(() => Math.random() - 0.5);
      const seedGenres = shuffleArray(Array.from(genres)).slice(0, 5);

      // Return the prepared seeds
      return {
        seed_artists: seedArtists.join(","), // Comma-separated string
        seed_tracks: seedTracks.join(","),   // Comma-separated string
        seed_genres: seedGenres.join(","),   // Comma-separated string
      };
    };

    // Fetch top artists and tracks
    const [topArtists, topTracks] = await Promise.all([
      fetchTopItems<Artist>("artists"),
      fetchTopItems<Track>("tracks"),
    ]);

    // Prepare the seeds
    const seeds = prepareSeedsForRecommendations(topArtists, topTracks);

    // Return the seeds
    return NextResponse.json(seeds);
  } catch (error) {
    console.error("Error fetching top items:", error);
    return NextResponse.json({ error: "Failed to fetch top items" }, { status: 500 });
  }
}
