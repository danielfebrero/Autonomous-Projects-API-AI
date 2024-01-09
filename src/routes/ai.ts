import express from "express"
import { v4 as uuidv4 } from "uuid"
import { unzip } from "zlib"

import {
  chat,
  createThread,
  addMessageToThreadAndRun,
} from "../controllers/openai"
import { generate } from "../controllers/vertex"
import { getSocket } from "../"
import { emitMessage } from "../utils/socket"
import { includeLastMessage } from "../utils/ai"
import { getThread, setThread } from "../services/threads"

const router = express.Router()

const AIs: any = {
  "gpt4-turbo": chat,
  "gemini-pro": generate,
}

router.post("/", async (req, res, next) => {
  const userId: string = res.locals.userId
  const ai = req.body.ai && req.body.ai.length > 0 ? req.body.ai : "gpt4-turbo"

  var instruction = req.body.instruction
  if (req.body.forwarded) {
    // ungzip instructions forwarded from textQueryInput
    const buffer = Buffer.from(req.body.instruction, "base64")
    instruction = await new Promise((resolve, reject) => {
      unzip(buffer, (err, result) => {
        if (err) {
          res.status(500).send(err)
          reject(err)
        } else {
          resolve(result.toString())
        }
      })
    })
  }
  if (
    req.body.params.reference &&
    req.body.params.reference === "ton dernier message"
  ) {
    instruction = includeLastMessage(userId, instruction, true)
  }

  res.send(200)
  const socket = getSocket(req.body.socketUuid)
  emitMessage(socket, userId, `Connecting with ${ai}...`, "text")

  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  AIs[ai]({ instruction, stream: true })
    .then(async (stream: any) => {
      for await (const part of stream) {
        const partText = part.choices[0]?.delta?.content || ""
        emitMessage(socket, userId, partText, "buffer", pendingTaskId)
      }
    })
    .catch((err: any) => {
      emitMessage(
        socket,
        userId,
        "Internal error: " + err,
        "buffer",
        pendingTaskId
      )
    })
})

router.post("/thread/new", async (req, res, next) => {
  res.send(200)

  const userId: string = res.locals.userId
  const socket = getSocket(req.body.socketUuid)
  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  createThread()
    .then((threadId: string) => {
      setThread(userId, threadId)
      emitMessage(socket, userId, threadId, "text", pendingTaskId)
    })
    .catch((err: any) => {
      emitMessage(
        socket,
        userId,
        "Internal error: " + err,
        "buffer",
        pendingTaskId
      )
    })
})

router.post("/thread/add", async (req, res, next) => {
  res.send(200)

  const userId: string = res.locals.userId
  const socket = getSocket(req.body.socketUuid)
  const pendingTaskId = uuidv4()
  emitMessage(socket, userId, pendingTaskId, "pending", pendingTaskId)

  const threadId = getThread(userId)
  if (!threadId) {
    emitMessage(
      socket,
      userId,
      "Internal error: No thread found for user",
      "text",
      pendingTaskId
    )
    return
  }

  const buffer = Buffer.from(req.body.instruction, "base64")
  const message: string = await new Promise((resolve, reject) => {
    unzip(buffer, (err, result) => {
      if (err) {
        res.status(500).send(err)
        reject(err)
      } else {
        resolve(result.toString())
      }
    })
  })

  if (!message) {
    emitMessage(
      socket,
      userId,
      "Internal error: No message found",
      "text",
      pendingTaskId
    )
    return
  }

  addMessageToThreadAndRun(threadId, message)
    .then((response: string) => {
      emitMessage(socket, userId, response, "markdown", pendingTaskId)
    })
    .catch((err: any) => {
      emitMessage(
        socket,
        userId,
        "Internal error: " + err,
        "text",
        pendingTaskId
      )
    })
})

export default router
