import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const trackId = params.id;

    // if not track id
    if (!trackId) {
      return NextResponse.json({ error: "Track ID is required" }, { status: 400 });
    }

    // our credentials
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify client credentials");
    }

    // from spotify, but the typescript version of OAuth
    const authUrl = "https://accounts.spotify.com/api/token";
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch(authUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`Failed to fetch Spotify token: ${tokenResponse.statusText}`);
    }

    const { access_token: accessToken } = await tokenResponse.json();

    // sse the token to fetch track details
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}?market=US`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch track: ${response.statusText}`);
    }

    const trackData = await response.json();
    return NextResponse.json(trackData);
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Issue with Spotify Client Credentials";

    console.error("Error:", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
