import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from ".."
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { runCommand } from "../services/unix"

const router = express.Router()

router.post("/", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)

      const pendingTaskId = uuidv4()
      emitMessage(
        socket,
        userId as string,
        pendingTaskId,
        "pending",
        pendingTaskId
      )

      const command = req.body.command.substring(1).trim()
      runCommand({ command, socket, userId: userId as string, pendingTaskId })
    })
    .catch(console.log)
})

export default router
