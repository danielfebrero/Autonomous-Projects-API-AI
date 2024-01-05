import express from "express"
import { v4 as uuidv4 } from "uuid"
import TwitterApi from "twitter-api-v2"
import { Request, Response } from "express"

import { getSocket } from ".."
import { auth, tweet } from "../controllers/twitter"
import { authClient } from "../controllers/auth"
import {
  getLastAgentResponseByUser,
  getBeforeLastAgentResponseByUser,
} from "./chat"
import { emitMessage } from "../utils/socket"
import { tweetLiveQuote } from "../plugins/tweet/live-quote"

const router = express.Router()

const serverTools: { [key: string]: Function } = {
  quotation: tweetLiveQuote,
}

const twitterUsers = new Map<string, any>()
const twitterStates = new Map<string, any>()

export const getTwitterUserByState = (state: string) => twitterUsers.get(state)
export const getTwitterStateByUserId = (userId: string) =>
  twitterStates.get(userId)
export const setTwitterUserByState = (state: string, user: any) =>
  twitterUsers.set(state, user)
export const setTwitterStateByUserId = (userId: string, state: string) =>
  twitterStates.set(userId, state)

const verifyTwitterUser = (res: Response, req: Request, userId: string) => {
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

router.post("/intent", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      const socket = verifyTwitterUser(res, req, userId)
      if (socket) {
        const matchedTool = serverTools[req.body.serverTool]
        if (!matchedTool) {
          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            "Je pense que vous faite référence à un outils de tweet, mais je ne connais pas cet outils.",
            "text"
          )
          return
        }

        emitMessage(socket, userId as string, "Tweeting...", "text")

        const pendingTaskId = uuidv4()
        emitMessage(
          socket,
          userId as string,
          pendingTaskId,
          "pending",
          pendingTaskId
        )

        matchedTool({ userId, ...req.body })
          .then((response: string) => {
            emitMessage(
              socket,
              userId as string,
              "Tweeted: " + response,
              "text",
              pendingTaskId
            )
          })
          .catch((error: string) => {
            res.status(500).send("Internal error when using the tool: " + error)
          })
      }
    })
    .catch((error) => {
      res.status(403).send("Invalid google signin credential!")
    })
})

router.post("/tweet", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      const socket = verifyTwitterUser(res, req, userId)
      if (socket) {
        const message = req.body.quote
          ? req.body.quote.replace(/^```|```$/g, "")
          : req.body.reference && req.body.reference === "ton dernier message"
          ? getLastAgentResponseByUser(userId ?? "")
          : req.body.reference &&
            req.body.reference === "ton avant-dernier message"
          ? getBeforeLastAgentResponseByUser(userId ?? "")
          : null

        emitMessage(socket, userId as string, "Tweeting...", "text")

        const pendingTaskId = uuidv4()
        emitMessage(
          socket,
          userId as string,
          pendingTaskId,
          "pending",
          pendingTaskId
        )

        if (!message) {
          emitMessage(
            socket,
            userId as string,
            "No message to tweet",
            "text",
            pendingTaskId
          )
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
            res.status(500).send("Internal error when tweeting: " + error)
          })
      }
    })
    .catch((error) => {
      res.status(403).send("Invalid google signin credential!")
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
