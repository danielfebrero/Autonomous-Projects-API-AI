import { v4 as uuidv4 } from "uuid"
import axios from "axios"

import { UserState } from "../user"
import {
  ChatConversation,
  ChatMessage,
  ChatState,
  ChatResponseFromServer,
} from "./types"
import { CredentialResponse } from "@react-oauth/google"

export const newConversation = (): ChatConversation => {
  return {
    id: uuidv4(),
    name: "New Conversation",
    lastMessage: "",
    messages: [],
  }
}

export const changeConversation = (
  state: ChatState,
  conversation: ChatConversation
) => {
  if (state.currentConversation?.id === conversation.id) return
  if (state.currentConversation)
    state.conversations.push(state.currentConversation)
  state.currentConversation = conversation
}

export const getConversation = (
  state: ChatState,
  conversationId: string
): ChatConversation | undefined => {
  return state.conversations.filter((c) => c.id === conversationId)[0]
}

export const sendMessageToServer = async ({
  message,
  user,
  conversationID,
}: {
  message: ChatMessage
  user: UserState
  conversationID?: string
}): Promise<ChatResponseFromServer[]> => {
  try {
    if (user?.credential === undefined) {
      return [{ error: "User not logged in" }]
    }
    const res = await axios.post(
      `${
        process.env.NODE_ENV === "production"
          ? "https://bard-407521.uc.r.appspot.com"
          : "http://localhost:8080"
      }/chat`,
      { message, user, app_id: process.env.GCLOUD_APP_ID, conversationID }
    )

    const chatResponseFromServer: ChatResponseFromServer[] = res.data
    return chatResponseFromServer
  } catch (err) {
    return [{ error: err }] as ChatResponseFromServer[]
  }
}

export const buildChatMessage = (
  textInput: string,
  user?: CredentialResponse
): ChatMessage => {
  return {
    id: uuidv4(),
    content: textInput,
    sender: user?.clientId ?? "server",
    timestamp: Date.now(),
  }
}
