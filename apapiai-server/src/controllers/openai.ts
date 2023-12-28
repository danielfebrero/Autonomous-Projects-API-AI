import OpenAI from "openai"

const openai = new OpenAI()

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

  console.log({ response })
  return response.choices[0]
}
