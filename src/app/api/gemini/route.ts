import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const POST = async (req: Request) => {
    const { question } = await req.json();

    try {
        const prompt: string = `You are a knowledgeable assistant that provides quality information. I am using Tiny MCE as the HTML 
        WYSIWYG editor. Now I am getting the information in the form of text as well as in form of code. Tell me the appropriate solution 
        to this question: ${question}`;

        const response = await model.generateContent(prompt);

        if (!response.response) {
            throw new Error("No response from Gemini AI");
        }

        console.log(`✅ ${response.response} ✅`);
        return NextResponse.json({ reply: response.response.text() });
    } catch (error: any) {
        console.error(`❌ ${error} ❌`);
        return NextResponse.json({ error: error.message });
    }
};
