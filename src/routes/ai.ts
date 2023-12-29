import express from "express"
import { v4 as uuidv4 } from "uuid"

import { chat } from "../controllers/openai"
import { generate } from "../controllers/vertex"
import { getSocket } from "../"
import { prepareResponseForWebapp } from "../utils/webapp"

const router = express.Router()

const AIs: any = {
  "gpt4-turbo": chat,
  "gemini-pro": generate,
}

router.post("/", (req, res, next) => {
  res.send(200)

  const socket = getSocket(req.body.socketUuid)
  socket?.emit(
    "message",
    prepareResponseForWebapp(`Connecting with ${req.body.ai}...`, "text")
  )

  const pendingTaskId = uuidv4()
  socket?.emit("message", prepareResponseForWebapp(pendingTaskId, "pending"))

  AIs[req.body.ai]({ instruction: req.body.instruction })
    .then((response: any) => {
      socket?.emit(
        "message",
        prepareResponseForWebapp(response.toString(), "text", pendingTaskId)
      )
    })
    .catch((err: any) => {
      console.log(err)
    })
})

export default router
