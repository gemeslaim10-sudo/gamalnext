import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAiConfig } from '@/lib/ai/config';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const config = await getAiConfig();
        const apiKey = config.geminiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: config.modelName || 'gemini-2.5-flash' });

        const prompt = `
        You are an expert resume writer and career coach. Your task is to extract, rewrite, and format the user's raw text into a professional, compelling one-page CV structure. 
        Enhance the descriptions, fix grammatical errors, use action verbs, and make it sound highly professional.
        If any vital information (like email, phone, or name) is missing, invent a generic placeholder (like "[Your Name]", "[Phone Number]"). 
        Do not add skills or experiences the user didn't mention at all, but enhance what is there.
        
        Respond ONLY with a valid JSON object matching this schema exactly:
        {
          "personalInfo": {
            "fullName": "string",
            "jobTitle": "string",
            "email": "string",
            "phone": "string",
            "location": "string"
          },
          "experience": [
            {
              "title": "string",
              "company": "string",
              "date": "string (e.g., Jan 2020 - Present)",
              "description": ["string", "string"] (Array of bullet points, enhanced and professional)
            }
          ],
          "education": [
            {
              "degree": "string",
              "institution": "string",
              "date": "string"
            }
          ],
          "skills": ["string", "string"] (Array of relevant skills based on their text),
          "languages": ["string", "string"]
        }

        User's raw text data:
        """
        ${text}
        """
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();
        
        // Remove markdown code blocks if present
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedJson = JSON.parse(textResponse);

        return NextResponse.json(parsedJson);
    } catch (error) {
        console.error('AI CV Error:', error);
        return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
    }
}
