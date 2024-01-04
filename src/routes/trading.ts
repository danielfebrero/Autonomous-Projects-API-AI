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
import { getTechnicalAnalysisFromBarchart } from "../plugins/trading/technical-analysis"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"

const router = express.Router()

const serverTools: { [key: string]: Function } = {
  quotation: getQuote,
  "décision de trade": getTradeDecision,
  "indicateurs techniques": getInsights,
  "données historiques": getHistoricalData,
  "analyse technique": getTechnicalAnalysisFromBarchart,
}

router.post("/intent", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const matchedTool = serverTools[req.body.serverTool]
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

      matchedTool({
        symbol: req.body.symbol,
      })
        .then((response: any) => {
          emitMessage(
            socket,
            userId as string,
            JSON.stringify(response),
            "json",
            pendingTaskId
          )
        })
        .catch((error: any) => {
          console.log(error)
        })
    })
    .catch(console.log)
})

router.post("/economic-calendar", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Fetching: economic calendar...`,
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

      getEconomicCalendarFromTE()
        .then((response) => {
          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            response.data as string,
            "markdown",
            pendingTaskId
          )
        })
        .catch((err: any) => console.log(err))
    })
    .catch(console.log)
})

export default router
