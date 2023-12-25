import { SessionsClient } from "@google-cloud/dialogflow-cx/build/src/v3beta1"

export const addMessageToConversation = async (
  conversationId: string,
  message: string
): Promise<void> => {
  const request = {
    queryInput: {
      text: {
        text: message,
        languageCode: "fr-FR",
      },
    },
  }
  const sessionClient = new SessionsClient({ projectId: "bard-407521" })
  const intent = await sessionClient.matchIntent(request)
  const fulfilledIntent = await sessionClient.fulfillIntent({
    matchIntentRequest: intent,
  } as any)
  console.log({ sessionClient, intent, fulfilledIntent })
}
