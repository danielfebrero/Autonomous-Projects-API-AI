import express from "express"
import {
  getHistoricalData,
  getQuote,
  getInsights,
} from "../controllers/yfinance"
import { prepareResponse } from "../utils/dialogflow"

const router = express.Router()

router.post("/historical", (req, res, next) => {
  getHistoricalData({
    symbol: req.body.symbol,
    period1: req.body.period1,
    period2: req.body.period2,
  })
    .then((response) => {
      res.json(prepareResponse(JSON.stringify(response)))
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

router.post("/quote", (req, res, next) => {
  getQuote({
    symbol: req.body.symbol,
  })
    .then((response) => {
      res.json(prepareResponse(JSON.stringify(response)))
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

router.post("/insights", (req, res, next) => {
  getInsights({
    symbol: req.body.symbol,
    lang: req.body.lang,
    reportsCount: req.body.reportsCount,
    region: req.body.region,
  })
    .then((response) => {
      res.json(prepareResponse(JSON.stringify(response)))
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

export default router
