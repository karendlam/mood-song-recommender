import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  // Retrieve the verifier from cookies (set in login route)
  const codeVerifier = req.headers
    .get("cookie")
    ?.split("; ")
    .find((cookie) => cookie.startsWith("code_verifier"))
    ?.split("=")[1];

  if (!code || !codeVerifier) {
    return NextResponse.json({ error: "Missing code or code verifier" }, { status: 400 });
  }

  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI!;

  // Exchange the authorization code for tokens
  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: SPOTIFY_CLIENT_ID,
      grant_type: "authorization_code",
      code,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
  }

  // const tokens = await tokenResponse.json();

  // Store the access token in a cookie
  const response = NextResponse.redirect("http://localhost:3000/chat");
  // response.cookies.set("access_token", tokens.access_token, {
  //   httpOnly: true, // Prevent JavaScript from accessing the cookie
  //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  //   path: "/", // Make the cookie available to the entire site
  // });

  return response;
}
