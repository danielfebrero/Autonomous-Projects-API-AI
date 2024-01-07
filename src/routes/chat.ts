import express from "express"
import { v4 as uuidv4 } from "uuid"

import { addToChat } from "../controllers/dialogflow"
import { prepareResponseForWebapp } from "../utils/webapp"

type AgentResponseType = { uuid: string; value: string | Buffer }

const agentResponsesByUser = new Map<string, AgentResponseType[]>()

export const getAgentResponsesByUser = (userId: string) =>
  agentResponsesByUser.get(userId)

export const setAgentResponsesByUser = (
  userId: string,
  responses: AgentResponseType[]
) => agentResponsesByUser.set(userId, responses)

export const getLastAgentResponseByUser = (userId: string) =>
  agentResponsesByUser.get(userId)?.[0].value

export const getBeforeLastAgentResponseByUser = (userId: string) =>
  agentResponsesByUser.get(userId)?.[1].value

export const addResponseToAgentResponsesByUser = (
  userId: string,
  response: string | Buffer,
  responseUuid?: string
) => {
  const responses = agentResponsesByUser.get(userId) ?? []
  const index = responses.findIndex((r) => r.uuid === responseUuid)
  const uuid = responseUuid ?? uuidv4()

  if (responseUuid && Buffer.isBuffer(response)) {
    const newValue = index
      ? Buffer.concat([
          response,
          Buffer.from(responses[index]?.value as Buffer),
        ])
      : response
    index
      ? responses.splice(index, 1, { uuid: responseUuid, value: newValue })
      : responses.unshift({ uuid: responseUuid, value: newValue })

    return responseUuid
  }

  if (responseUuid && index > -1) {
    responses.splice(index, 1, { uuid: responseUuid, value: response })
  } else {
    responses.unshift({ uuid, value: response })
  }

  agentResponsesByUser.set(userId, responses)
  return uuid
}

const router = express.Router()

router.post("/", async (req, res) => {
  const userId: string = res.locals.userId
  const convResponse = await addToChat(
    userId,
    req.body.message,
    req.body.socketUuid,
    req.body.credential,
    req.body.appId
  )
  if (convResponse) {
    addResponseToAgentResponsesByUser(userId, convResponse)
    res.send(
      prepareResponseForWebapp(convResponse as unknown as string, "text")
    )
  } else {
    res.send(200)
  }
})

export default router
