import {
  SessionsClient,
  AgentsClient,
} from "@google-cloud/dialogflow-cx/build/src/v3beta1"

export const addMessageToConversation = async (
  conversationId: string,
  message: string
): Promise<void> => {
  const agentClient = new AgentsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  })
  const agent = await agentClient.getAgent({
    name: `projects/${process.env.PROJECT_ID}/locations/us-central1/agents/${process.env.AGENT_ID}`,
  })
  console.log({ agent })
}
