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
        stream: true, //send generated text as it becomes available
      });
    
    // Create a ReadableStream to handle the streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
        try {
          // Iterate over the streamed chunks of the response
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
            if (content) {
              const text = encoder.encode(content) // Encode the content to Uint8Array
              controller.enqueue(text) // Enqueue the encoded text to the stream
            }
          }
        } catch (err) {
          controller.error(err) // Handle any errors that occur during streaming
        } finally {
          controller.close() // Close the stream when done
        }
      },
    })

    return new NextResponse(stream) // Return the stream as the response
  }





