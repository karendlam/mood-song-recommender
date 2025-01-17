import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { scores, seeds } = await req.json();
    const accessToken = req.headers
      .get("cookie")
      ?.split("; ")
      .find((cookie) => cookie.startsWith("access_token"))
      ?.split("=")[1];

    if (!accessToken) {
      return NextResponse.json({ error: "Missing access token" }, { status: 401 });
    }

    // Combine seeds and scores into Spotify API parameters
    const params = new URLSearchParams({
      seed_artists: seeds.seed_artists,
      seed_tracks: seeds.seed_tracks,
      seed_genres: seeds.seed_genres,
      min_valence: scores.spotifyParams.min_valence,
      max_valence: scores.spotifyParams.max_valence,
      min_energy: scores.spotifyParams.min_energy,
      max_energy: scores.spotifyParams.max_energy,
      min_danceability: scores.spotifyParams.min_danceability,
      max_danceability: scores.spotifyParams.max_danceability,
    });

    // Call Spotify API
    const response = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}
