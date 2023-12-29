import {
  VertexAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google-cloud/vertexai"

export const generate = async (instruction: string) => {
  // Initialize Vertex with your Cloud project and location
  const vertexAI = new VertexAI({
    project: "bard-407521",
    location: "us-central1",
  })

  // Instantiate the model
  const generativeVisionModel = vertexAI.preview.getGenerativeModel({
    model: "gemini-pro",
    safety_settings: [
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ],
    generation_config: { max_output_tokens: 256 },
  })

  const textPart = {
    text: instruction,
  }

  const request = {
    contents: [{ role: "user", parts: [textPart] }],
  }

  console.log("Prompt Text:")
  console.log(request.contents[0].parts[0].text)

  console.log("Non-Streaming Response Text:")
  // Create the response stream
  const responseStream = await generativeVisionModel.generateContentStream(
    request
  )

  // Wait for the response stream to complete
  const aggregatedResponse = await responseStream.response

  // Select the text from the response
  const fullTextResponse =
    aggregatedResponse.candidates[0].content.parts[0].text

  return fullTextResponse
}
