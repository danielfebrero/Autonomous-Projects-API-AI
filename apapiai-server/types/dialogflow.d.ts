import { AgentsClient, SessionsClient } from "@google-cloud/dialogflow-cx"

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

export type AgentType = NonNullable<ExtractType<FirstOverloadOfAgentsClient>>
export type FlowType = NonNullable<ExtractType<FirstOverloadOfFlowsClient>>
export type IntentResponseType = NonNullable<
  ExtractType<FirstOverloadOfIntentResponse>
>
