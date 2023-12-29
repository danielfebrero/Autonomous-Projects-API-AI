import express from "express"

import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../plugins/trading/investing-technical-indicators"
import { getSocket } from "../"
import { prepareResponseForWebapp } from "../utils/webapp"

const router = express.Router()

router.post(
  "/trading/investing-technical-indicators-market-data",
  (req, res, next) => {
    res.send("Fetching data...")
    getTechnicalIndicatorsFromInvestingAndMarketData(req.body.symbol)
      .then((response) => {
        const socket = getSocket(req.body.socketUuid)
        socket?.emit(
          "message",
          prepareResponseForWebapp(
            response.responseFromGPT as unknown as string,
            "text"
          )
        )
        socket?.emit(
          "message",
          prepareResponseForWebapp(JSON.stringify(response.quotes), "json")
        )
      })
      .catch((err: any) => console.log(err))
  }
)

export default router
