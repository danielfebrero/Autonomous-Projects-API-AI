import express from "express"

import { prepareResponse } from "../utils/dialogflow"

const router = express.Router()

router.post("/", (req, res, next) => {
  const response = prepareResponse("Hello, world from the server!")
  res.json(response)
})

export default router
