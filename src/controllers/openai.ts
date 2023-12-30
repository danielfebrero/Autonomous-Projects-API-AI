import OpenAI from "openai"
import { ThreadCreateParams } from "openai/src/resources/beta/threads"

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

  return response.choices[0].message.content
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

export const createAndRunThread = async (
  messages: ThreadCreateParams.Message[],
  assistant_id: string,
  metadata: Record<string, unknown>,
  instructions: string
) => {
  const thread = await openai.beta.threads.create({ messages, metadata })
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id,
    additional_instructions: instructions,
  })

  var loops = 0
  const interval = setInterval(async () => {
    const checkedRun = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    )
    if (checkedRun.status === "completed") {
      clearInterval(interval)

      const threadMessages = await openai.beta.threads.messages.list(thread.id)
      const response = await openai.beta.threads.messages.retrieve(
        thread.id,
        threadMessages.data[0].id
      )

      // @ts-ignore
      return response.content.text.value
    }

    loops++
    if (loops > 36) {
      clearInterval(interval)
      throw new Error("Timeout after 3 minutes")
    }
  }, 1000 * 5)
}
