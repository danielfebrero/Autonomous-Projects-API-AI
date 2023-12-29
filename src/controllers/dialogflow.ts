import { SessionsClient } from "@google-cloud/dialogflow-cx/build/src/v3beta1"

import { IntentResponseType } from "../types/dialogflow"

export const addToChat = async (
  userId: string,
  query: string,
  socketUuid: string
) => {
  const sessionsClient = new SessionsClient({
    apiEndpoint: "us-central1-dialogflow.googleapis.com",
  })

  return await detectIntentText(query, userId, sessionsClient, socketUuid)
}

async function detectIntentText(
  query: string,
  sessionId: string,
  sessionClient: SessionsClient,
  socketUuid: string
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
    queryParams: {
      parameters: {
        fields: {
          socketUuid: {
            stringValue: socketUuid,
          },
        },
      },
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

  return response?.queryResult?.responseMessages &&
    response?.queryResult?.responseMessages[0]?.text?.text
    ? response?.queryResult?.responseMessages[0]?.text?.text.join("\n\n")
    : null
}
