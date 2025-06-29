import { NextResponse } from "next/server";
import OpenAI from "openai";
import { CoachingOptions } from "../../../services/options";
// import { CoachingOptions } from "/services/options.js"; // <-- changed from .jsx to .js

export async function POST(req) {
  try {    const { topic, coachingOption, msg } = await req.json();
    
    // Remove character count suffix and clean input
    const cleanedMsg = msg?.trim().replace(/\(\d+\s*chars?\)/gi, '').replace(/undefined|null|NaN/g, '') || '';
    const cleanedTopic = topic?.trim().replace(/\(\d+\s*chars?\)/gi, '').replace(/undefined|null|NaN/g, '') || '';

    if (!cleanedMsg || !cleanedTopic) {
      return NextResponse.json({ 
        error: "Invalid input" 
      }, { status: 400 });
    }

    const option = CoachingOptions.find((item) => item.name === coachingOption);
    const PROMPT = option.prompt.replace('{user_topic}', cleanedTopic);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: process.env.NEXT_PUBLIC_AI_OPENROUTER || process.env.AI_OPENROUTER,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3-0324:free",
      messages: [
        { role: "assistant", content: PROMPT },
        { role: "user", content: cleanedMsg }
      ],
    });

    // Clean AI response
    if (completion?.choices?.[0]?.message?.content) {
      completion.choices[0].message.content = 
        completion.choices[0].message.content
          .replace(/\b(undefined|null|NaN)\b/gi, '')
          .replace(/undefined|null|NaN/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
    }

    return NextResponse.json(completion);
  } catch (err) {
    return NextResponse.json({ 
      error: err.message || "AI server error" 
    }, { status: 500 });
  }
}
