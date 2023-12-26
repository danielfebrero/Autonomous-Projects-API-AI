import { AgentsClient } from "@google-cloud/dialogflow-cx/build/src/v3beta1"

export type AgentClientType = (typeof AgentsClient)["prototype"]["getAgent"]
type Callback<T, U, V> = (arg1: T, arg2: U, arg3: V) => void
type ExtractIAgent<T> = T extends Callback<any, infer Test, any> ? Test : never
type FirstOverload = Awaited<
  AgentClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]

type AgentType = NonNullable<ExtractIAgent<FirstOverload>>

export const startConversation = async (agent: AgentType) => {}

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
