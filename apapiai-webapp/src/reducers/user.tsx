import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CredentialResponse } from "@react-oauth/google"

export type GoogleSigninResponse = CredentialResponse

export type UserState = GoogleSigninResponse & {}

const initialState: UserState = {
  clientId: undefined,
  credential: undefined,
  select_by: undefined,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signin: (state, action: PayloadAction<GoogleSigninResponse>) => {
      state.clientId = action.payload.clientId
      state.credential = action.payload.credential
      state.select_by = action.payload.select_by
    },
  },
})

export const { signin } = userSlice.actions

export default userSlice.reducer
