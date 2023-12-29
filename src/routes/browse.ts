import express from "express"
import { v4 as uuidv4 } from "uuid"

import { getSocket } from "../"
import { prepareResponseForWebapp } from "../utils/webapp"
import { retrieve } from "../controllers/browse"
const router = express.Router()

router.post("/", (req, res, next) => {
  retrieve({ url: req.body.url, selector: req.body.selector })
    .then((response) => res.status(200).json(response))
    .catch((err: any) => res.status(500).send(err))
})

router.post("/screenshot", (req, res, next) => {
  res.send(200)

  const socket = getSocket(req.body.socketUuid)
  socket?.emit(
    "message",
    prepareResponseForWebapp("Browsing and taking a screenshot...", "text")
  )

  const pendingTaskId = uuidv4()
  socket?.emit("message", prepareResponseForWebapp(pendingTaskId, "pending"))

  retrieve({ url: req.body.url, selector: req.body.selector ?? "html" })
    .then((response) => {
      socket?.emit(
        "message",
        prepareResponseForWebapp(response.img, "image", pendingTaskId)
      )
    })
    .catch((err: any) => console.log(err))
})

export default router
