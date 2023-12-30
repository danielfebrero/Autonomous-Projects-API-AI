import express from "express"
import { v4 as uuidv4 } from "uuid"
import TwitterApi from "twitter-api-v2"

import { getSocket } from ".."
import { auth, tweet } from "../controllers/twitter"
import { authClient } from "../controllers/auth"
import { getLastAgentResponseByUser } from "./chat"
import { emitMessage } from "../utils/socket"

const router = express.Router()

const twitterUsers = new Map<string, any>()
const twitterStates = new Map<string, any>()

export const getTwitterUserByState = (state: string) => twitterUsers.get(state)
export const getTwitterStateByUserId = (userId: string) =>
  twitterStates.get(userId)
export const setTwitterUserByState = (state: string, user: any) =>
  twitterUsers.set(state, user)
export const setTwitterStateByUserId = (userId: string, state: string) =>
  twitterStates.set(userId, state)

router.post("/tweet", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
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
      } else {
        res.send(200)

        const message = req.body.quote
          ? req.body.quote.replace(/^```|```$/g, "")
          : req.body.quoteReference &&
            req.body.quoteReference === "last-agent-message"
          ? getLastAgentResponseByUser(userId ?? "")
          : null

        emitMessage(socket, userId as string, "Tweeting...", "text")

        const pendingTaskId = uuidv4()
        emitMessage(socket, userId as string, pendingTaskId, "pending")

        if (!message) {
          emitMessage(socket, userId as string, "No message to tweet", "text")
          return
        }

        tweet(userId ?? "", message)
          .then((response: string) => {
            emitMessage(
              socket,
              userId as string,
              "Tweeted: " + response,
              "text",
              pendingTaskId
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
  const twitterUser = getTwitterUserByState(state as string)
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
    clientSecret: process.env.TWITTER_CLIENT_SECRET,
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
        setTwitterUserByState(state as string, twitterUser)
        res.redirect("/")
      }
    )
    .catch((err) =>
      res.status(403).send("Invalid verifier or access tokens!: " + err)
    )
})

export default router
