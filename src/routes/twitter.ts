import express from "express"
import { v4 as uuidv4 } from "uuid"
import TwitterApi from "twitter-api-v2"

import { getSocket } from ".."
import { prepareResponseForWebapp } from "../utils/webapp"
import { auth, tweet } from "../controllers/twitter"
import { authClient } from "../controllers/auth"

const router = express.Router()

const twitterUsers = new Map<string, any>()
const twitterStates = new Map<string, any>()

export const getTwitterUser = (userId: string) => twitterUsers.get(userId)
export const getTwitterState = (state: string) => twitterStates.get(state)
export const setTwitterUser = (userId: string, state: string) =>
  twitterUsers.set(userId, state)
export const setTwitterState = (state: string, user: any) =>
  twitterUsers.set(state, user)

router.post("/tweet", (req, res, next) => {
  authClient(req.body.user.credential, req.body.app_id)
    .then(async (userId) => {
      const state = getTwitterUser(userId ?? "")
      const twitterUser = getTwitterState(state ?? "")
      const loggedClient = twitterUser?.loggedClient
      const socket = getSocket(req.body.socketUuid)

      if (!loggedClient) {
        const redirectUrl = auth(userId as string)

        socket?.emit(
          "message",
          prepareResponseForWebapp(
            "[Login to twitter](" + redirectUrl + ")",
            "link"
          )
        )
        res.send(200)
      } else {
        res.send(200)

        socket?.emit("message", prepareResponseForWebapp("Tweeting...", "text"))

        const pendingTaskId = uuidv4()
        socket?.emit(
          "message",
          prepareResponseForWebapp(pendingTaskId, "pending")
        )
        tweet(userId ?? "", req.body.tweet)
          .then((response: string) => {
            socket?.emit(
              "message",
              prepareResponseForWebapp(response, "text", pendingTaskId)
            )
          })
          .catch((error) => {
            console.log(error)
          })
      }
    })
    .catch((error) => {
      console.log(error)
    })
})

router.get("/callback", (req, res) => {
  // Extract state and code from query string
  const { state, code } = req.query
  // Get the saved codeVerifier from session
  const twitterUser = getTwitterUser(state as string)
  const { codeVerifier, state: sessionState } = twitterUser

  if (!codeVerifier || !state || !sessionState || !code) {
    return res.status(400).send("You denied the app or your session expired!")
  }
  if (state !== sessionState) {
    return res.status(400).send("Stored tokens didnt match!")
  }

  // Obtain access token
  const client = new TwitterApi({
    // @ts-ignore
    clientId: process.env.TWITTER_CLIENT_ID,
  })

  const stringCode = code as string
  client
    .loginWithOAuth2({
      code: stringCode,
      codeVerifier,
      redirectUri: process.env.TWITTER_CALLBACK_URL ?? "",
    })
    .then(
      async ({
        client: loggedClient,
        accessToken,
        refreshToken,
        expiresIn,
      }) => {
        twitterUser.loggedClient = loggedClient
        twitterUser.accessToken = accessToken
        twitterUser.refreshToken = refreshToken
        twitterUser.expiresIn = expiresIn
        setTwitterUser(state as string, twitterUser)

        // Example request
        // const { data: userObject } = await loggedClient.v2.me()
      }
    )
    .catch(() => res.status(403).send("Invalid verifier or access tokens!"))
})

export default router
