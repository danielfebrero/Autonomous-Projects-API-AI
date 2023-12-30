import { prepareResponseForWebapp } from "./webapp"
import { addResponseToAgentResponsesByUser } from "../routes/chat"

export const emitMessage = (
  socket: any,
  userId: string,
  message: string,
  type: string,
  pendingTaskId?: string
) => {
  addResponseToAgentResponsesByUser(userId ?? "", message)
  socket.emit("message", prepareResponseForWebapp(message, type, pendingTaskId))
}
