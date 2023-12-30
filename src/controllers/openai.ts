import OpenAI from "openai"
import { ThreadCreateParams } from "openai/src/resources/beta/threads"
import { toFile } from "openai/uploads"

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
  instructions: string,
  metadata: Record<string, unknown>
): Promise<string> => {
  const thread = await openai.beta.threads.create({ messages, metadata })
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id,
    additional_instructions: instructions,
    tools: [{ type: "retrieval" }],
  })

  var loops = 0
  var returnResponse: string | undefined = undefined
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
      returnResponse = response.content.text.value
    }

    loops++
    if (loops > 36) {
      clearInterval(interval)
      throw new Error("Timeout after 3 minutes")
    }
  }, 1000 * 5)

  while (returnResponse === undefined) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return returnResponse
}

export const storeFileForMessages = async (strFile: any) => {
  const file = await toFile(Buffer.from(strFile))
  const fileResponse = await openai.files.create({
    file,
    purpose: "assistants",
  })

  return fileResponse
}

export const storeFileAtAssistant = async (
  strFile: any,
  assistantId: string
) => {
  const fileResponse = await storeFileForMessages(strFile)
  const response = await openai.beta.assistants.files.create(assistantId, {
    file_id: fileResponse.id,
  })

  return response.id
}

export const buildMessage = ({
  textContent,
  fileId,
}: {
  textContent: string
  fileId: string
}) => {
  return {
    content: textContent,
    role: "user",
    file_id: fileId,
    metadata: {
      author: "Daniel Febrero",
      tool: "apapia",
    },
  } as ThreadCreateParams.Message
}
