import { Request, Response } from "express"

import { getSocket } from "../../"
import { emitMessage } from "../../utils/socket"
import { auth } from "../../controllers/twitter"

const twitterUsers = new Map<string, any>()
const twitterStates = new Map<string, any>()

export const getTwitterUserByState = (state: string) => twitterUsers.get(state)
export const getTwitterStateByUserId = (userId: string) =>
  twitterStates.get(userId)
export const setTwitterUserByState = (state: string, user: any) =>
  twitterUsers.set(state, user)
export const setTwitterStateByUserId = (userId: string, state: string) =>
  twitterStates.set(userId, state)

export const verifyTwitterUser = (
  res: Response,
  req: Request,
  userId: string
) => {
  const state = getTwitterStateByUserId(userId ?? "")
  const twitterUser = getTwitterUserByState(state ?? "")
  const loggedClient = twitterUser?.loggedClient
  const socket = getSocket(req.body.socketUuid)

  if (!loggedClient) {
    const redirectUrl = auth(userId as string)

    emitMessage(
      socket,
      userId as string,
      "[Login to twitter](" + redirectUrl + ")",
      "link"
    )
    res.send(200)
    return false
  } else {
    res.send(200)
    return socket
  }
}
