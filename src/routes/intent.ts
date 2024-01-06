import express from "express"
import { v4 as uuidv4 } from "uuid"

import {
  getHistoricalData,
  getQuote,
  getInsights,
} from "../controllers/yfinance"
import { getSocket } from "../"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { getTradeDecision } from "../plugins/trading/trade-decision/trade-decision"
import { tweetLiveQuote } from "../plugins/tweet/live-quote"
import { verifyTwitterUser } from "../services/twitter"
import { getTechnicalAnalysisCake } from "../services/trading"

const getServerTools: { [key: string]: Function } = {
  quotation: getQuote,
  "décision de trade": getTradeDecision,
  "indicateurs techniques": getInsights,
  "données historiques": getHistoricalData,
  "analyse technique": getTechnicalAnalysisCake,
}

const twitterServerTools: { [key: string]: Function } = {
  quotation: tweetLiveQuote,
}

const router = express.Router()

router.post("/", (req, res) => {
  console.log({ req: req.body })
  switch (String(req.body.action).toLowerCase()) {
    case "récupère":
      authClient(req.body.credential, req.body.appId)
        .then(async (userId) => {
          res.send(200)

          const matchedTool = getServerTools[req.body.serverTool]
          if (!matchedTool) {
            const socket = getSocket(req.body.socketUuid)
            emitMessage(
              socket,
              userId as string,
              "Je pense que vous faite référence à un outils de trading, mais je ne connais pas cet outils.",
              "text"
            )
            return
          }

          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            `Fetching: ${req.body.serverTool}...`,
            "text"
          )

          const pendingTaskId = uuidv4()
          emitMessage(
            socket,
            userId as string,
            pendingTaskId,
            "pending",
            pendingTaskId
          )

          matchedTool({ ...req.body })
            .then((response: any) => {
              emitMessage(
                socket,
                userId as string,
                response.content,
                response.type,
                pendingTaskId
              )
            })
            .catch((error: any) => {
              console.log(error)
            })
        })
        .catch(console.log)
      break

    case "tweet":
      authClient(req.body.credential, req.body.appId)
        .then(async (userId) => {
          const socket = verifyTwitterUser(res, req, userId)
          if (socket) {
            const matchedTool = twitterServerTools[req.body.serverTool]
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
                res
                  .status(500)
                  .send("Internal error when using the tool: " + error)
              })
          }
        })
        .catch((error) => {
          res.status(403).send("Invalid google signin credential!")
        })
      break

    default:
      res.send(404)
      break
  }
})

export default router
