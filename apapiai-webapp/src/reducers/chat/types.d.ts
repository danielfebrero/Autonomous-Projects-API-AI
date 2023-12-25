export type ChatConversation = {
  id: string
  name: string
  lastMessage: string
  messages: ChatMessage[]
}

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
