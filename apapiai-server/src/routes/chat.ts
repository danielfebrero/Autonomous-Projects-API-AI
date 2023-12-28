import express from "express"
import cors from "cors"
import { authClient } from "../controllers/auth"
import dotenv from "dotenv"

import { addToChat } from "../controllers/dialogflow"

const router = express.Router()
dotenv.config()

//Configure CORS
const corsOptions = {
  origin: "*",
  methods: "GET,POST",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
}

router.use("/", cors(corsOptions))

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
