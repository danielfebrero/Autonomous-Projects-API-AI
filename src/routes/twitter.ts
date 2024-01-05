import express from "express"
import { v4 as uuidv4 } from "uuid"
import TwitterApi from "twitter-api-v2"

import { tweet } from "../controllers/twitter"
import { authClient } from "../controllers/auth"
import {
  getLastAgentResponseByUser,
  getBeforeLastAgentResponseByUser,
} from "./chat"
import { emitMessage } from "../utils/socket"
import { verifyTwitterUser } from "../services/twitter"
import {
  getTwitterUserByState,
  setTwitterUserByState,
} from "../services/twitter"

const router = express.Router()

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
