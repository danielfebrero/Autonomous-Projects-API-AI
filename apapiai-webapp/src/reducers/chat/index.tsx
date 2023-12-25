import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {
  getConversation,
  newConversation,
  changeConversation,
  sendMessageToServer,
} from "./utils"
import { ChatMessage, ChatState, ChatMessagePayload } from "./types"

// Define the initial state using that type
const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  chatTextInput: "",
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
    addMessage: (state, action: PayloadAction<ChatMessagePayload>) => {
      if (action.payload.message.sender === undefined) return
      if (!state.currentConversation) {
        const conv = newConversation()
        changeConversation(state, conv)
      }
      state.currentConversation?.messages.push(action.payload.message)
      sendMessageToServer({
        message: action.payload.message,
        user: action.payload.user,
      })
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
