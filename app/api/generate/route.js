import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:
1. Create clear and concise questions for the front side of the flashcard.
2. Provide an accurate and concise answer for the back of the flashcard.
3. Ensure each flashcard focuses on a single concept or piece of information.
4. Make the question and answers simple for the user to understand, assume they are a middle school student.
5. Include a variety of question types, such as definitions, examples, comparisons, true/false, and applications.
6. Avoid complex phrasing of both questions and answers.
7. When appropriate, use menumonics or memory aids to help reinforce the information.
8. Tailor the difficulty of the flashcard to user's specified preference.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balance set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

Remember, they goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON format

{
    "flashcards": [
        {
            "front": "Front of the card"
            "back": "Back of the card"
        } 
    ]
}
`;

export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.text();

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: data,
      },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const flashcards = JSON.parse(completion.choices[0].message.content);

  return NextResponse.json(flashcards.flashcards);
}
