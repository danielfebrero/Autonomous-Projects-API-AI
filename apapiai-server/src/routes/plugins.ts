import express from "express"
import { getTechnicalIndicatorsFromInvesting } from "../plugins/trading/investing-technical-indicators"

const router = express.Router()

router.post("/trading/investing-technical-indicators", (req, res, next) => {
  getTechnicalIndicatorsFromInvesting(req.body.symbol)
    .then((response) => res.status(200).json(response))
    .catch((err: any) => res.status(500).send("error: " + err))
})

export default router
