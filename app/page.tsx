"use client";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "/api/spotify/login";
  };

  return (
    <main style={{ textAlign: "center", marginTop: "20vh" }}>
      <h1>Welcome to My Spotify App</h1>
      <p>Login to access your Spotify profile and personalized features.</p>
      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#1DB954",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Login with Spotify
      </button>
    </main>
  );
}
