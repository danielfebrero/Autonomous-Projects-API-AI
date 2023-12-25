import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type ChatConversation = {
  id: string
  name: string
  lastMessage: string
  messages: ChatMessage[]
}

type ChatMessage = {
  id: string
  content: string
  sender: string
  timestamp: number
}

interface ChatState {
  conversations: ChatConversation[]
  currentConversation: ChatConversation | null
}

// Define the initial state using that type
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createConversation: (state, action: PayloadAction<ChatConversation>) => {
      state.currentConversation = action.payload
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      if (state.currentConversation?.id === action.payload) return
      if (state.currentConversation)
        state.conversations.push(state.currentConversation)
      state.currentConversation = state.conversations.filter(
        (c) => c.id === action.payload
      )[0]
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload
      )
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.currentConversation?.messages.push(action.payload)
    },
  },
})

export const { createConversation, setCurrentConversation, addMessage } =
  chatSlice.actions

export default chatSlice.reducer
