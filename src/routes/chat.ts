import express from "express"
import { authClient } from "../controllers/auth"

import { addToChat } from "../controllers/dialogflow"
import { prepareResponseForWebapp } from "../utils/webapp"

const router = express.Router()

router.post("/", (req, res) => {
  authClient(req.body.user.credential, req.body.app_id)
    .then(async (userId) => {
      const convResponse = await addToChat(
        userId ?? "",
        req.body.message,
        req.body.socketUuid
      )
      res.send(
        prepareResponseForWebapp(convResponse as unknown as string, "text")
      )
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

export default router
