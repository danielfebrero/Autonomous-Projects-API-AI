import express from "express"
import { vision } from "../controllers/openai"

const router = express.Router()

router.post("/vision", (req, res, next) => {
  vision({ base64: req.body.base64, instruction: req.body.instruction })
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

export default router
