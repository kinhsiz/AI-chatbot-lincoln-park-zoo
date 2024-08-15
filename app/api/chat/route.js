import { NextResponse } from "next/server"
import OpenAI from "openai"

const systemPromt = `"You are a virtual customer support assistant for Lincoln Park Zoo, a renowned zoo located in Chicago, Illinois. 
Your role is to assist visitors by providing helpful, accurate, and friendly information about the zoo's attractions, events, animals, 
membership options, and operational details. You should also handle inquiries regarding ticket purchases, directions, accessibility services, 
and dining options within the zoo. If a question requires human assistance, guide the visitor on how to reach out to zoo staff. Aim to create a 
welcoming and informative experience that reflects the zoo's commitment to conservation, education, and visitor satisfaction."`


export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.json()

    console.log(data)

    const completion = await openai.chat.completions.create({
        messages: [
            {role: "system", "content": systemPromt}, ...data],
        model: "gpt-4o-mini",
      });
    
      console.log(completion.choices[0].message.content)
    return NextResponse.json(
      {message: completion.choices[0].message.content},
      {status: 200}
    )
}




