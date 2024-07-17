import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const { question } = await req.json();

    // console.log(`🚀 ${question} 🚀`);

    try {
        const response = await fetch(
            `https://api.openai.com/v1/chat/completions`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a knowledgeable assistant that provides quality information.",
                        },
                        {
                            role: "user",
                            content: `Tell me ${question}`,
                        },
                    ],
                }),
            },
        );

        const responseData = await response.json();
        console.log({ responseData });
        if (responseData.error) {
            throw new Error(responseData.error.message);
        }

        const reply = responseData.choices[0].message.content;

        console.log(`✅ ${reply} ✅`);

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error(`❌ ${error} ❌`);
        return NextResponse.json({ error: error.message });
    }
};
