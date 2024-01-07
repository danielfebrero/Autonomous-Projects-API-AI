import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from "../"
import { retrieve } from "../controllers/browse"
import { emitMessage } from "../utils/socket"

const router = express.Router()

router.post("/", (req, res, next) => {
  retrieve({ url: req.body.url, selector: req.body.selector })
    .then((response) => res.status(200).json(response))
    .catch((err: any) => res.status(500).send(err))
})

router.post("/screenshot", (req, res, next) => {
  res.send(200)
  const userId: string = res.locals.userId

  const socket = getSocket(req.body.socketUuid)
  emitMessage(socket, userId, `Browsing and taking a screenshot...`, "text")

  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  retrieve({ url: req.body.url, selector: req.body.selector ?? "html" })
    .then((response) => {
      emitMessage(socket, userId, response.img, "image", pendingTaskId)
    })
    .catch((err: any) => console.log(err))
})

export default router
