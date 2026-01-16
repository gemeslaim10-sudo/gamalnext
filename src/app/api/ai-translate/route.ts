import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text, targetLang, sourceLang } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        You are a professional translator. Translate the following text from ${sourceLang || 'auto'} to ${targetLang}.
        
        Rules:
        1. Maintain the original tone and formatting.
        2. Do not explain anything, just output the translation.
        3. If the text is technical, use appropriate terminology.

        Text to translate:
        "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translation = response.text();

        return NextResponse.json({ translation });
    } catch (error) {
        console.error('Translation Error:', error);
        return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
    }
}
