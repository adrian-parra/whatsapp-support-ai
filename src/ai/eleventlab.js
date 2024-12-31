import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function toAudio(text) {
    const response = await client.textToSpeech.convert("pNInz6obpgDQGcFmaJgB", {
        output_format: "mp3_44100_128",
        text: text,
        model_id: "eleven_multilingual_v2"
    });
    return response
}
