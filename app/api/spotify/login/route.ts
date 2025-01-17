import { NextResponse } from "next/server";

function generateCodeVerifier(length: number): string {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length })
    .map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
    .join("");
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function GET() {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  // Store the verifier securely, e.g., using cookies or session
  const response = NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      response_type: "code",
      redirect_uri: SPOTIFY_REDIRECT_URI,
      scope: "user-top-read user-read-private playlist-read-private user-read-email",
      code_challenge_method: "S256",
      code_challenge: challenge,
    })}`
  );
  response.cookies.set("code_verifier", verifier, { httpOnly: true, secure: true });

  return response;
}
