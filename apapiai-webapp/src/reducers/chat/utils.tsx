import { v4 as uuidv4 } from "uuid"
import axios from "axios"

import { UserState } from "../user"
import { ChatConversation, ChatMessage, ChatState } from "./types"

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

export const sendMessageToServer = ({
  message,
  user,
}: {
  message: ChatMessage
  user: UserState
}) => {
  if (user?.credential === undefined) return
  axios
    .post(
      `${
        process.env.NODE_ENV === "production"
          ? "https://bard-407521.uc.r.appspot.com"
          : "http://localhost:8080"
      }/chat`,
      { message, user }
    )
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}
