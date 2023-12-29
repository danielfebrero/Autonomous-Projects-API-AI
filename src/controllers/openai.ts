import OpenAI from "openai"
import dotenv from "dotenv"

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const vision = async ({
  base64,
  instruction,
}: {
  base64: string
  instruction: string
}) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    max_tokens: 4096,
    temperature: 0.5,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop: ["###"],
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: instruction },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,{${base64}}`,
              detail: "high",
            },
          },
        ],
      },
    ],
  })

  return response.choices[0]
}

export const chat = async ({ instruction }: { instruction: string }) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    max_tokens: 4096,
    temperature: 0.5,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop: ["###"],
    messages: [
      {
        role: "user",
        content: instruction,
      },
    ],
  })

  return response.choices[0].message.content
}
