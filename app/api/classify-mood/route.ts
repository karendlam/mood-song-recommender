import { NextResponse } from "next/server";

type Emotion = {
    label: string;
    score: number;
};

type CoreEmotions = {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    fear: number;
    love: number;
};

type SubEmotionScores = {
    joy: number;
    nostalgia: number;
    depression: number;
    yearning: number;
    frustration: number;
    resentment: number;
    disgust: number;
    shock: number;
    awe: number;
    anxiety: number;
    love: number;
};

type PredictionsResponse = Emotion[][];

type RequestBody = {
    inputs: string;
};


type ResponseData = {
    subEmotionScores?: SubEmotionScores;
    error?: string;
};

function mapToSubEmotions(emotions: CoreEmotions): SubEmotionScores {
    const scale = (value: number) => Math.max(0, Math.min(1, value));

    return {
    joy: scale(0.8 * emotions.joy),
    nostalgia: scale(0.5 * emotions.sadness + 0.4 * emotions.joy),
    depression: scale(0.8 * emotions.sadness),
    yearning: scale(0.4 * emotions.sadness + 1.0 * emotions.love),
    frustration: scale(0.8 * emotions.anger + 0.2 * emotions.sadness),
    resentment: scale(0.7 * emotions.anger + 0.3 * emotions.fear),
    disgust: scale(0.7 * emotions.anger + 0.3 * emotions.surprise),
    shock: scale(1.0 * emotions.surprise),
    awe: scale(1 * emotions.surprise + 0.4 * emotions.joy),
    anxiety: scale(0.8 * emotions.fear + 0.7 * emotions.sadness),
    love: scale(0.8 * emotions.love)
    };
}

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
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs }),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API Error: ${response.statusText}`);
        }

        const classifications: PredictionsResponse = await response.json();

        const emotions: CoreEmotions = classifications[0].reduce(
            (acc: CoreEmotions, { label, score }: Emotion) => {
                if (label in acc) {
                    acc[label as keyof CoreEmotions] = score; 
                    }
                return acc;
            },
            { joy: 0, sadness: 0, anger: 0, surprise: 0, fear: 0, love: 0 } as CoreEmotions
        );

        const subEmotionScores = mapToSubEmotions(emotions);

        console.log(subEmotionScores)

        const highestEmotion = Object.keys(subEmotionScores).reduce((highest, key) => {
            return subEmotionScores[key as keyof typeof subEmotionScores] >
            subEmotionScores[highest as keyof typeof subEmotionScores]
            ? key
            : highest;
        }, Object.keys(subEmotionScores)[0]);

        return NextResponse.json({ highestEmotion });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

        console.error("Error:", errorMessage);

        const result: ResponseData = {
            error: errorMessage,
        };

        return NextResponse.json(result, { status: 500 });
    }
}
