import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from ".."
import { emitMessage } from "../utils/socket"
import { runCommand } from "../services/unix"

const router = express.Router()

router.post("/", (req, res, next) => {
  res.send(200)
  const userId: string = res.locals.userId

  const socket = getSocket(req.body.socketUuid)

  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  const command = req.body.command.substring(1).trim()
  runCommand({ command, socket, userId: userId, pendingTaskId })
})

export default router
