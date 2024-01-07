import { spawnCommand } from "../../controllers/unix"
import { emitMessage } from "../../utils/socket"

export const runCommand = ({
  command,
  socket,
  userId,
  pendingTaskId,
}: {
  command: string
  socket: any
  userId: string
  pendingTaskId: string
}) => {
  spawnCommand({
    command,
    onDataStdout: (data) => {
      emitMessage(socket, userId, data + "\n", "buffer", pendingTaskId)
    },
    onClose: (code) => {
      emitMessage(
        socket,
        userId,
        Buffer.from(`exited with code ${code}`),
        "buffer",
        pendingTaskId
      )
    },
  })
}
