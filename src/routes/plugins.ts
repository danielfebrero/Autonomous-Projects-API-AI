import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getTechnicalAnalysisFromBarchart } from "../plugins/trading/technical-analysis"
import { getSocket } from "../"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { getTradeDecision } from "../plugins/trading/trade-decision/trade-decision"

const router = express.Router()

router.post("/trading/technical-analysis", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Fetching technical indicators...`,
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

      getTechnicalAnalysisFromBarchart(req.body.symbol)
        .then((response) => {
          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            response as string,
            "markdown",
            pendingTaskId
          )
        })
        .catch((err: any) => console.log(err))
    })
    .catch(console.log)
})

router.post("/trading/economic-calendar", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Fetching economic calendar...`,
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

router.post("/trading/trade-decision", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Fetching trade decision...`,
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

      getTradeDecision(req.body.symbol)
        .then((response) => {
          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            response,
            "markdown",
            pendingTaskId
          )
        })
        .catch((err: any) => console.log(err))
    })
    .catch(console.log)
})

export default router
