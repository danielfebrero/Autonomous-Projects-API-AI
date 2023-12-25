import {
  ParticipantsClient,
  ConversationsClient,
} from "@google-cloud/dialogflow/build/src/v2beta1"

export const addMessageToConversation = async (
  conversationId: string,
  message: string
): Promise<void> => {
  const conversationsClient = new ConversationsClient()
  if (!conversationId) {
    const newConversation = (await conversationsClient.createConversation({
      parent: "projects/" + process.env.PROJECT_ID,
      conversation: {},
    })) as unknown as { name: string }
    const conversationParams = newConversation?.name.split("/")
    conversationId = conversationParams[conversationParams.length - 1]
    console.log({ conversationId, newConversation })
  }
}
