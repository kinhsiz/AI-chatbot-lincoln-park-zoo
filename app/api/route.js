import { NextResponse } from "next/server"
import OpenAI from "openai"


export async function POST(req) {
    const openai = new OpenAI('org-w2sb8ugXkQJQbAzsiFHoYv3G')
    const data = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is a LLM?"}
          ],
        model: "gpt-4o-mini",
      });
    
      console.log(completion.choices[0]);
    
    
    return NextResponse.json({message: 'hellow from the server'})
}




