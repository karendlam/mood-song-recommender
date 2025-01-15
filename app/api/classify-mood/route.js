import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the input from the request body
        const { inputs } = await req.json();

        // Hugging Face API info
        const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
        const API_URL = "https://api-inference.huggingface.co/models/bhadresh-savani/distilbert-base-uncased-emotion";

        // Make a POST request to the Hugging Face API
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputs }),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API Error: ${response.statusText}`);
        }

        const predictions = await response.json();

        // do something to the response to get valanece and energy values 
        const emotions = predictions[0]; // Assuming emotions are in the first array
        const totalScore = emotions.reduce((sum, item) => sum + item.score, 0);
        const averageScore = totalScore / emotions.length;

        // Return the aggregated data
        return NextResponse.json({
            sentiment : averageScore,
        });
    } catch (error) {
        console.error("Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
