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
  responseUuid: string
}

export type ChatMessage = {
  id: string
  content: {
    type: MessageTypes
    value: string
  }
  sender?: string
  timestamp: number
  responseUuid?: string
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
    type: MessageTypes
    value: string
  }
  sender?: string
  timestamp?: number
  responseUuid?: string
}

export type MessageTypes =
  | "text"
  | "json"
  | "image"
  | "pending"
  | "link"
  | "markdown"
  | "buffer"
