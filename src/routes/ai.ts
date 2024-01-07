import express from "express"
import { v4 as uuidv4 } from "uuid"

import { chat } from "../controllers/openai"
import { generate } from "../controllers/vertex"
import { getSocket } from "../"
import { emitMessage } from "../utils/socket"
import { includeLastMessage } from "../utils/ai"

const router = express.Router()

const AIs: any = {
  "gpt4-turbo": chat,
  "gemini-pro": generate,
}

router.post("/", (req, res, next) => {
  res.send(200)
  const userId: string = res.locals.userId
  const ai = req.body.ai && req.body.ai.length > 0 ? req.body.ai : "gpt4-turbo"

  var instruction = req.body.instruction
  if (req.body.reference && req.body.reference === "ton dernier message") {
    instruction = includeLastMessage(userId, instruction, false)
  }
  if (req.body.forwarded)
    instruction = includeLastMessage(userId, instruction, true)

  const socket = getSocket(req.body.socketUuid)
  emitMessage(socket, userId, `Connecting with ${ai}...`, "text")

  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  AIs[ai]({ instruction })
    .then((response: any) => {
      emitMessage(
        socket,
        userId,
        response.toString(),
        "markdown",
        pendingTaskId
      )
    })
    .catch((err: any) => {
      console.log(err)
    })
})

export default router
