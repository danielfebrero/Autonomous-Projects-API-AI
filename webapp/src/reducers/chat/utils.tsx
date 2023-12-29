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
  socketUuid,
}: {
  message: string
  user: UserState
  conversationID?: string
  socketUuid: string
}): Promise<ChatResponseFromServer | undefined> => {
  try {
    if (user.credential !== undefined) {
      const res = await axios.post(
        `${
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080"
            : "https://apt-leman.darkeccho.com"
        }/chat`,
        {
          message,
          user,
          app_id: process.env.GCLOUD_APP_ID,
          conversationID,
          socketUuid,
        }
      )

      const chatResponseFromServer: ChatResponseFromServer = res.data
      return chatResponseFromServer
    }
  } catch (err) {
    console.log(err)
  }
}

export const buildChatMessage = (
  t: ChatResponseFromServer,
  user?: CredentialResponse
): ChatMessage => {
  return {
    timestamp: Date.now(),
    ...t,
    id: uuidv4(),
    sender: user?.clientId ?? "apapiai",
  }
}

export const buildMessageFromText = (t: string): ChatResponseFromServer => {
  return {
    timestamp: Date.now(),
    content: {
      type: "text",
      value: t,
    },
  }
}

export const scrollToBottom = () => {
  document
    .getElementById("chat-messages")
    ?.scrollTo(
      0,
      document.getElementById("chat-messages")?.scrollHeight ?? 1000
    )
}
