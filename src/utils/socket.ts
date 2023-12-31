import { v4 as uuidv4 } from "uuid"

import { prepareResponseForWebapp } from "./webapp"
import { addResponseToAgentResponsesByUser } from "../routes/chat"

export const emitMessage = (
  socket: any,
  userId: string,
  message: string | Buffer,
  type: string,
  uuid?: string
) => {
  const responseUuid = addResponseToAgentResponsesByUser(
    userId ?? "",
    message,
    uuid
  )
  socket.emit(
    "message",
    prepareResponseForWebapp(message, type, uuid ?? responseUuid)
  )
  return uuid ?? responseUuid
}
