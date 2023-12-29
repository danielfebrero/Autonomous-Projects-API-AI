import express from "express"
import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../plugins/trading/investing-technical-indicators"
import { getSocket } from "../"

const router = express.Router()

router.post(
  "/trading/investing-technical-indicators-market-data",
  (req, res, next) => {
    res.send("Fetching data...")
    getTechnicalIndicatorsFromInvestingAndMarketData(req.body.symbol)
      .then((response) => {
        const socket = getSocket(req.body.socketUuid)
        socket.emit("message", response.responseFromGPT)
        socket.emit("message", JSON.stringify(response.quotes))
      })
      .catch((err: any) => console.log(err))
  }
)

export default router
