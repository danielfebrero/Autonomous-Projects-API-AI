import express from "express"
import { v4 as uuidv4 } from "uuid"

import { chat } from "../controllers/openai"
import { generate } from "../controllers/vertex"
import { getSocket } from "../"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"

const router = express.Router()

const AIs: any = {
  "gpt4-turbo": chat,
  "gemini-pro": generate,
}

router.post("/", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Connecting with ${req.body.ai}...`,
        "text"
      )

      const pendingTaskId = uuidv4()
      emitMessage(socket, userId as string, pendingTaskId, "pending")

      AIs[req.body.ai]({ instruction: req.body.instruction })
        .then((response: any) => {
          emitMessage(
            socket,
            userId as string,
            response.toString(),
            "text",
            pendingTaskId
          )
        })
        .catch((err: any) => {
          console.log(err)
        })
    })
    .catch(console.log)
})

export default router
