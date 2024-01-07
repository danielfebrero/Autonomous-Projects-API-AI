import OpenAI from "openai"
import { ThreadCreateParams } from "../override/openai/src/resources/beta/threads"
import { toFile } from "../override/openai/uploads"
import { ChatCompletion } from "openai/resources"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_2,
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

export const chat = async ({
  instruction,
  stream,
}: {
  instruction: string
  stream?: boolean
}) => {
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
    stream: stream ?? false,
  })

  if (!stream) return (response as ChatCompletion).choices[0].message.content
  else return response
}

export const createAndRunThread = async (
  messages: ThreadCreateParams.Message[],
  assistant_id: string,
  instructions: string,
  metadata: Record<string, unknown>
): Promise<string> => {
  const thread = await openai.beta.threads.create({ messages, metadata })
  console.log({ thread: thread.id })
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

      returnResponse = response.content.reduce((acc, curr) => {
        if (curr.type === "text") {
          return acc + "\n\n" + curr.text.value
        }
        return acc
      }, "")
    }

    loops++
    if (loops > 36) {
      clearInterval(interval)
      throw new Error("Timeout after 3 minutes")
    }
  }, 1000 * 10)

  while (returnResponse === undefined) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return returnResponse
}

export const storeFileForMessages = async (strFile: any, fileName: string) => {
  const file = await toFile(Buffer.from(strFile), fileName)
  const fileResponse = await openai.files.create({
    file,
    purpose: "assistants",
  })

  return fileResponse
}

export const storeFileAtAssistant = async (
  strFile: any,
  fileName: string,
  assistantId: string
) => {
  const fileResponse = await storeFileForMessages(strFile, fileName)
  const response = await openai.beta.assistants.files.create(assistantId, {
    file_id: fileResponse.id,
  })

  return response.id
}

export const buildMessage = ({
  textContent,
  fileIds,
}: {
  textContent: string
  fileIds: string[]
}) => {
  return {
    content: textContent,
    role: "user",
    file_ids: fileIds,
    metadata: {
      author: "Daniel Febrero",
      tool: "apapiai",
      tool_version: "1.0.0",
    },
  } as ThreadCreateParams.Message
}
