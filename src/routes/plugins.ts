import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../plugins/trading/investing-technical-indicators"
import { getSocket } from "../"
import { prepareResponseForWebapp } from "../utils/webapp"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"

const router = express.Router()

router.post(
  "/trading/investing-technical-indicators-market-data",
  (req, res, next) => {
    res.send(200)

    const socket = getSocket(req.body.socketUuid)
    socket?.emit(
      "message",
      prepareResponseForWebapp("Fetching technical indicators...", "text")
    )

    const pendingTaskId = uuidv4()
    socket?.emit("message", prepareResponseForWebapp(pendingTaskId, "pending"))

    const pendingTaskId2 = uuidv4()
    socket?.emit("message", prepareResponseForWebapp(pendingTaskId2, "pending"))

    getTechnicalIndicatorsFromInvestingAndMarketData(req.body.symbol)
      .then((response) => {
        const socket = getSocket(req.body.socketUuid)
        socket?.emit(
          "message",
          prepareResponseForWebapp(
            response.responseFromGPT as unknown as string,
            "markdown",
            pendingTaskId
          )
        )
        socket?.emit(
          "message",
          prepareResponseForWebapp(
            JSON.stringify(response.quotes),
            "json",
            pendingTaskId2
          )
        )
      })
      .catch((err: any) => console.log(err))
  }
)

router.post("/trading/economic-calendar", (req, res, next) => {
  res.send(200)

  const socket = getSocket(req.body.socketUuid)
  socket?.emit(
    "message",
    prepareResponseForWebapp("Fetching economic calendar...", "text")
  )

  const pendingTaskId = uuidv4()
  socket?.emit("message", prepareResponseForWebapp(pendingTaskId, "pending"))

  getEconomicCalendarFromTE()
    .then((response) => {
      const socket = getSocket(req.body.socketUuid)
      socket?.emit(
        "message",
        prepareResponseForWebapp(
          response.data as string,
          "markdown",
          pendingTaskId
        )
      )
    })
    .catch((err: any) => console.log(err))
})

export default router
