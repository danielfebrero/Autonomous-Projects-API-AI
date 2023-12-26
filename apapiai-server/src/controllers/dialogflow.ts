import {
  AgentsClient,
  FlowsClient,
  SessionsClient,
} from "@google-cloud/dialogflow-cx/build/src/v3beta1"

type AgentsClientType = (typeof AgentsClient)["prototype"]["getAgent"]
type FlowsClientType = (typeof AgentsClient)["prototype"]["getAgent"]
type Callback<T, U, V> = (arg1: T, arg2: U, arg3: V) => void
type ExtractIAgent<T> = T extends Callback<any, infer Test, any> ? Test : never
type FirstOverloadOfAgentsClient = Awaited<
  AgentsClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]
type FirstOverloadOfFlowClient = Awaited<
  FlowsClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]

type AgentType = NonNullable<ExtractIAgent<FirstOverloadOfAgentsClient>>
type FlowType = NonNullable<ExtractIAgent<FirstOverloadOfFlowClient>>

export const startConversation = async () => {
  const agentClient = new AgentsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  })
  const agentObject = (await agentClient.getAgent({
    name: `projects/${process.env.PROJECT_ID}/locations/us-central1/agents/${process.env.AGENT_ID}`,
  })) as unknown as AgentType[]
  const agent = agentObject[0]

  const flowClient = new FlowsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  })
  const flow = (await flowClient.getFlow({
    name: agent?.startFlow,
  })) as unknown as FlowType[]

  console.log({ agent, flow })
}

export const addMessageToConversation = async (
  conversationId: string,
  message: string
): Promise<void> => {}
