import { UserState } from "../user"

export type ChatConversation = {
  id: string
  conversationID?: string
  name: string
  lastMessage: string
  messages: ChatMessage[]
}

export type ChatMessagePayload = { message: ChatMessage; user: UserState }

export type ChatMessage = {
  id: string
  content: string
  sender?: string
  timestamp: number
}

export interface ChatState {
  conversations: ChatConversation[]
  currentConversation: ChatConversation | null
  chatTextInput: string
}
