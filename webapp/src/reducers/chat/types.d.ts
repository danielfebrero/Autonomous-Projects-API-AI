import { UserState } from "../user"

export type ChatConversation = {
  id: string
  conversationID?: string
  name: string
  lastMessage: string
  messages: ChatMessage[]
}

export type ChatMessagePayload = { message: ChatMessage; user?: UserState }

export type ReplaceChatMessagePayload = ChatMessagePayload & {
  pendingTaskId: string
}

export type ChatMessage = {
  id: string
  content: {
    type: "text" | "json" | "image" | "pending"
    value: string
  }
  sender?: string
  timestamp: number
}

export interface ChatState {
  conversations: ChatConversation[]
  currentConversation: ChatConversation | null
  chatTextInput: string
}

export type TextReponseFromServer = {
  text: string[]
}

export type ChatResponseFromServer = {
  content: {
    type: "text" | "json" | "image" | "pending"
    value: string
  }
  sender?: string
  timestamp?: number
  pendingTaskId?: string
}
