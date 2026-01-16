import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { text, type } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
        You are a Data Analyst. Convert the following unstructured text into a structured ${type || 'JSON'} table format.
        
        Rules:
        1. Identify headers and rows.
        2. If the output type is 'json', return pure JSON array of objects.
        3. If the output type is 'html', return a standard HTML <table> string with tailwind classes for styling (bg-slate-800, border-slate-700, p-2).
        4. If the output type is 'csv', return standard CSV format.
        5. Do not include markdown code blocks (like \`\`\`json), just the raw data.

        Text to process:
        "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const data = response.text();

        // Clean up markdown if AI adds it despite instructions
        const cleanData = data.replace(/```(json|html|csv)?/g, '').replace(/```/g, '').trim();

        return NextResponse.json({ data: cleanData });
    } catch (error) {
        console.error('Table Gen Error:', error);
        return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }
}
