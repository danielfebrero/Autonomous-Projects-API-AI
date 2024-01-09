import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from "../"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"
import {
  getHistoricalData,
  getQuote,
  getInsights,
} from "../controllers/yfinance"
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

router.post("/intent", (req, res) => {
  const userId: string = res.locals.userId
  const socket = getSocket(req.body.socketUuid)
  res.send(200)

  switch (String(req.body.action).toLowerCase()) {
    case "récupère":
      const matchedTool = getServerTools[req.body.serverTool]
      if (!matchedTool) {
        emitMessage(
          socket,
          userId as string,
          "Je pense que vous faite référence à un outils de trading, mais je ne connais pas cet outils.",
          "text"
        )
        return
      }

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
        .catch((err: any) => {
          emitMessage(
            socket,
            userId as string,
            "Internal error: " + err,
            "text",
            pendingTaskId
          )
        })
      break

    case "tweet":
      const twitterUser = verifyTwitterUser(res, req, userId)
      if (twitterUser) {
        const matchedTool = twitterServerTools[req.body.serverTool]
        if (!matchedTool) {
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
          .catch((err: string) => {
            emitMessage(
              socket,
              userId as string,
              "Internal error: " + err,
              "text",
              pendingTaskId
            )
          })
      }
      break

    default:
      res.send(404)
      break
  }
})

router.post("/economic-calendar", (req, res, next) => {
  res.send(200)
  const userId: string = res.locals.userId

  const socket = getSocket(req.body.socketUuid)
  emitMessage(socket, userId, `Fetching: economic calendar...`, "text")

  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  getEconomicCalendarFromTE()
    .then((response) => {
      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId,
        response.content,
        response.type,
        pendingTaskId
      )
    })
    .catch((err: any) => console.log(err))
})

export default router
