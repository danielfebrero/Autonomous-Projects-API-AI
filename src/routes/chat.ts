import express from "express"
import { authClient } from "../controllers/auth"
import dotenv from "dotenv"

import { addToChat } from "../controllers/dialogflow"

const router = express.Router()
dotenv.config()

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.post("/", (req, res) => {
  authClient(req.body.user.credential, req.body.app_id)
    .then(async (userId) => {
      const convResponse = await addToChat(
        userId ?? "",
        req.body.message.content,
        req.body.socketUuid
      )
      res.send(convResponse)
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

export default router
