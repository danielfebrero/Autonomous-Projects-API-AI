import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { getConversation, newConversation, changeConversation } from "./utils"
import {
  ChatState,
  ChatMessagePayload,
  ReplaceChatMessagePayload,
} from "./types"

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
    },
    setChatTextInput: (state, action: PayloadAction<string>) => {
      state.chatTextInput = action.payload
    },
    replaceMessage: (
      state,
      action: PayloadAction<ReplaceChatMessagePayload>
    ) => {
      const chatMessage = {
        message: action.payload.message,
        user: action.payload.user,
      }
      const messages = state.currentConversation?.messages.reduce(
        (acc: any, v) => {
          return v.content.type === "pending" &&
            v.content.value === action.payload.pendingTaskId
            ? [...acc, chatMessage.message]
            : [...acc, v]
        },
        [] as any[]
      )

      if (state.currentConversation?.messages)
        state.currentConversation.messages = messages
    },
  },
})

export const {
  createConversation,
  setCurrentConversation,
  addMessage,
  replaceMessage,
  setChatTextInput,
} = chatSlice.actions

export default chatSlice.reducer
