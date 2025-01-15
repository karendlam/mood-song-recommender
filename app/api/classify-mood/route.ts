import { NextResponse } from "next/server";

type Emotion = {
  label: string;
  score: number;
};

type PredictionsResponse = Emotion[][];

type RequestBody = {
  inputs: string;
};

type ResponseData = {
  sentiment?: number;
  error?: string;
};

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the input from the request body
    const { inputs }: RequestBody = await req.json();

    // Hugging Face API info
    const HUGGING_FACE_API_TOKEN = process.env.HUGGING_FACE_API_TOKEN;
    if (!HUGGING_FACE_API_TOKEN) {
      throw new Error("Hugging Face API token is missing");
    }

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

    const predictions: PredictionsResponse = await response.json();

    // Process the response to calculate sentiment
    const emotions = predictions[0]; // Assuming emotions are in the first array

    const totalScore = emotions.reduce((sum, item) => sum + item.score, 0);
    const averageScore = totalScore / emotions.length;

    // Return the aggregated data
    const result: ResponseData = {
      sentiment: averageScore,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    console.error("Error:", errorMessage);

    const result: ResponseData = {
      error: errorMessage,
    };

    return NextResponse.json(result, { status: 500 });
  }
}