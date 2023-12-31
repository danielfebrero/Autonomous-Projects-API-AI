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

const router = express.Router()

router.post("/historical", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        "Fetching historical data...",
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

      getHistoricalData({
        symbol: req.body.symbol,
        period1: req.body.period1,
        period2: req.body.period2,
      })
        .then((response) => {
          emitMessage(
            socket,
            userId as string,
            JSON.stringify(response),
            "json",
            pendingTaskId
          )
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(console.log)
})

router.post("/quote", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(socket, userId as string, "Fetching quote...", "text")

      const pendingTaskId = uuidv4()
      emitMessage(
        socket,
        userId as string,
        pendingTaskId,
        "pending",
        pendingTaskId
      )

      getQuote({
        symbol: req.body.symbol,
      })
        .then((response) => {
          emitMessage(
            socket,
            userId as string,
            JSON.stringify(response),
            "json",
            pendingTaskId
          )
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(console.log)
})

router.post("/insights", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(socket, userId as string, "Fetching insights...", "text")

      const pendingTaskId = uuidv4()
      emitMessage(
        socket,
        userId as string,
        pendingTaskId,
        "pending",
        pendingTaskId
      )

      getInsights({
        symbol: req.body.symbol,
        lang: req.body.lang,
        reportsCount: req.body.reportsCount,
        region: req.body.region,
      })
        .then((response) => {
          emitMessage(
            socket,
            userId as string,
            JSON.stringify(response),
            "json",
            pendingTaskId
          )
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(console.log)
})

export default router
