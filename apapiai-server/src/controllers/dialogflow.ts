import {
  AgentsClient,
  FlowsClient,
  SessionsClient,
} from "@google-cloud/dialogflow-cx/build/src/v3beta1"

type AgentsClientType = (typeof AgentsClient)["prototype"]["getAgent"]
type SessionsClientType = (typeof SessionsClient)["prototype"]["detectIntent"]
type FlowsClientType = (typeof AgentsClient)["prototype"]["getAgent"]
type Callback<T, U, V> = (arg1: T, arg2: U, arg3: V) => void
type ExtractType<T> = T extends Callback<any, infer Type, any> ? Type : never
type FirstOverloadOfAgentsClient = Awaited<
  AgentsClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]
type FirstOverloadOfFlowsClient = Awaited<
  FlowsClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]
type FirstOverloadOfIntentResponse = Awaited<
  SessionsClientType extends {
    (arg1: infer P1, arg2: infer P2): infer R
  }
    ? [P1, P2, R]
    : never
>[1]

type AgentType = NonNullable<ExtractType<FirstOverloadOfAgentsClient>>
type FlowType = NonNullable<ExtractType<FirstOverloadOfFlowsClient>>
type IntentResponseType = NonNullable<
  ExtractType<FirstOverloadOfIntentResponse>
>

export const startConversation = async (query: string) => {
  // const agentsClient = new AgentsClient({
  //   apiEndpoint: "us-central1-dialogflow.googleapis.com",
  // })
  // const agentsObject = (await agentsClient.getAgent({
  //   name: `projects/${process.env.PROJECT_ID}/locations/us-central1/agents/${process.env.AGENT_ID}`,
  // })) as unknown as AgentType[]
  // const agent = agentsObject[0]

  // const flowsClient = new FlowsClient({
  //   apiEndpoint: "us-central1-dialogflow.googleapis.com",
  // })
  // const flowsObject = (await flowsClient.getFlow({
  //   name: agent?.startFlow,
  // })) as unknown as FlowType[]
  // const flow = flowsObject[0]

  const sessionsClient = new SessionsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  })

  const sessionId = Math.random().toString(36).substring(7)

  return await detectIntentText(query, sessionId, sessionsClient)

  // console.log({ agent, flow })
}

async function detectIntentText(
  query: string,
  sessionId: string,
  sessionClient: SessionsClient
) {
  const sessionPath = sessionClient.projectLocationAgentSessionPath(
    process.env.PROJECT_ID ?? "",
    "us-central1",
    process.env.AGENT_ID ?? "",
    sessionId
  )

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
      },
      languageCode: "fr-FR",
    },
  }

  const [response] = (await sessionClient.detectIntent(request)) as unknown as [
    IntentResponseType
  ]

  for (const message of response?.queryResult?.responseMessages ?? []) {
    if (message.text) {
      console.log(`Agent Response: ${message.text.text}`)
    }
  }
  if (response?.queryResult?.match?.intent) {
    console.log(
      `Matched Intent: ${response.queryResult.match.intent.displayName}`
    )
  }
  console.log(
    `Current Page: ${response?.queryResult?.currentPage?.displayName}`
  )

  return response?.queryResult?.responseMessages
}

export const addMessageToConversation = (query: string, sessionId: string) => {}
