import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

type ChatConversation = {
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

interface ChatState {
  conversations: ChatConversation[]
  currentConversation: ChatConversation | null
  chatTextInput: string
}

// Define the initial state using that type
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  chatTextInput: "",
}

const newConversation = (): ChatConversation => {
  return {
    id: uuidv4(),
    name: "New Conversation",
    lastMessage: "",
    messages: [],
  }
}

const changeConversation = (
  state: ChatState,
  conversation: ChatConversation
) => {
  if (state.currentConversation?.id === conversation.id) return
  if (state.currentConversation)
    state.conversations.push(state.currentConversation)
  state.currentConversation = conversation
}

const getConversation = (
  state: ChatState,
  conversationId: string
): ChatConversation | undefined => {
  return state.conversations.filter((c) => c.id === conversationId)[0]
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<null>) => {
      const conv = newConversation()
      changeConversation(state, conv)
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      const conv = getConversation(state, action.payload)
      if (conv) changeConversation(state, conv)
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (action.payload.sender === undefined) return
      if (!state.currentConversation) {
        const conv = newConversation()
        changeConversation(state, conv)
      }
      state.currentConversation?.messages.push(action.payload)
    },
    setChatTextInput: (state, action: PayloadAction<string>) => {
      state.chatTextInput = action.payload
    },
  },
})

export const {
  createConversation,
  setCurrentConversation,
  addMessage,
  setChatTextInput,
} = chatSlice.actions

export default chatSlice.reducer
