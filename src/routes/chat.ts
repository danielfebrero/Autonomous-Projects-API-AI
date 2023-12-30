import express from "express"
import { authClient } from "../controllers/auth"

import { addToChat } from "../controllers/dialogflow"
import { prepareResponseForWebapp } from "../utils/webapp"

const agentResponsesByUser = new Map<string, string[]>()

export const getAgentResponsesByUser = (userId: string) =>
  agentResponsesByUser.get(userId)

export const setAgentResponsesByUser = (userId: string, responses: string[]) =>
  agentResponsesByUser.set(userId, responses)

export const getLastAgentResponseByUser = (userId: string) =>
  agentResponsesByUser.get(userId)?.[0]

export const addResponseToAgentResponsesByUser = (
  userId: string,
  response: string
) => {
  const responses = agentResponsesByUser.get(userId)
  if (responses) {
    responses.unshift(response)
  } else {
    agentResponsesByUser.set(userId, [response])
  }
}

const router = express.Router()

router.post("/", (req, res) => {
  authClient(req.body.user.credential, req.body.app_id)
    .then(async (userId) => {
      const convResponse = await addToChat(
        userId ?? "",
        req.body.message,
        req.body.socketUuid,
        req.body.user.credential,
        req.body.app_id
      )
      if (convResponse) {
        addResponseToAgentResponsesByUser(userId ?? "", convResponse)
        res.send(
          prepareResponseForWebapp(convResponse as unknown as string, "text")
        )
      } else {
        res.send(200)
      }
    })
    .catch((error) => {
      console.log(error)
      res.status(500).send(error)
    })
})

export default router
