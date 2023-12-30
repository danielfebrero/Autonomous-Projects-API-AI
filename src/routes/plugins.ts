import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../plugins/trading/investing-technical-indicators"
import { getSocket } from "../"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { getTradeDecision } from "../plugins/trading/trade-decision/trade-decision"

const router = express.Router()

router.post(
  "/trading/investing-technical-indicators-market-data",
  (req, res, next) => {
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
        emitMessage(socket, userId as string, pendingTaskId, "pending")

        const pendingTaskId2 = uuidv4()
        emitMessage(socket, userId as string, pendingTaskId2, "pending")

        getTechnicalIndicatorsFromInvestingAndMarketData(req.body.symbol)
          .then((response) => {
            const socket = getSocket(req.body.socketUuid)
            emitMessage(
              socket,
              userId as string,
              response.responseFromGPT as string,
              "markdown",
              pendingTaskId
            )
            emitMessage(
              socket,
              userId as string,
              JSON.stringify(response.quotes),
              "json",
              pendingTaskId2
            )
          })
          .catch((err: any) => console.log(err))
      })
      .catch(console.log)
  }
)

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
      emitMessage(socket, userId as string, pendingTaskId, "pending")

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
      emitMessage(socket, userId as string, pendingTaskId, "pending")

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
