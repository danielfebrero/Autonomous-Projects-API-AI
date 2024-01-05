import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from "../"
import { authClient } from "../controllers/auth"
import { emitMessage } from "../utils/socket"
import { getEconomicCalendarFromTE } from "../plugins/trading/economic-calendar"

const router = express.Router()

router.post("/economic-calendar", (req, res, next) => {
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.send(200)

      const socket = getSocket(req.body.socketUuid)
      emitMessage(
        socket,
        userId as string,
        `Fetching: economic calendar...`,
        "text"
      )

      const pendingTaskId = uuidv4()
      emitMessage(
        socket,
        userId as string,
        pendingTaskId,
        "pending",
        pendingTaskId
      )

      getEconomicCalendarFromTE()
        .then((response) => {
          const socket = getSocket(req.body.socketUuid)
          emitMessage(
            socket,
            userId as string,
            response.content,
            response.type,
            pendingTaskId
          )
        })
        .catch((err: any) => console.log(err))
    })
    .catch(console.log)
})

export default router
