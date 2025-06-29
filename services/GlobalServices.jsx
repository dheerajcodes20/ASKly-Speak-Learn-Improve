import axios from 'axios';
import { CoachingOptions, CoachingExpert } from './options';



// Upload audio file to AssemblyAI and get a transcript
export const transcribeAudio = async (audioUrl) => {
    try {
        const response = await axios.post(
            'https://api.assemblyai.com/v2/transcript',
            {
                audio_url: audioUrl
            },
            {
                headers: {
                    authorization: process.env.NEXT_PUBLIC_ASSEMBLY_API_KEY || process.env.ASSEMBLY_API_KEY,
                    'content-type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (err) {
        console.error("transcribeAudio error:", err?.response?.data?.error || err.message);
        return { error: err?.response?.data?.error || "Something went wrong" };
    }
};


export const AIModel = async (topic, coachingOption, msg) => {
  try {
    const response = await axios.post('/api/ai-model', {
      topic,
      coachingOption,
      msg,
    });
    return response.data;
  } catch (err) {
    console.error("AIModel error:", err?.response?.data?.error || err.message);
    return { error: err?.response?.data?.error || "Something went wrong" };
  }
};




export const CovertTextToSpeech = async (text, expertName) => {
    console.log("[TTS] Called with:", text, expertName); // Debug log
    if (!text || !expertName) {
        throw new Error("Text or expertName missing for TTS");
    }
    // Map expertName to correct Amazon Polly voiceId
    let voiceId = "Joanna"; // Default
    if (expertName === "Joey") voiceId = "Joey";
    else if (expertName === "Salli") voiceId = "Salli";
    else if (expertName === "Joanna") voiceId = "Joanna";

    const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId })
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error('TTS API error: ' + (err.error || response.statusText));
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return url;
};
