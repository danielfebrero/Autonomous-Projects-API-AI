import { spawnCommand } from "../../controllers/unix"
import { emitMessage } from "../../utils/socket"

export const runCommand = ({
  command,
  args,
  socket,
  userId,
}: {
  command: string
  args: string[]
  socket: any
  userId: string
}) => {
  var onDataStdoutResponseUuid: any
  spawnCommand({
    command,
    args,
    onDataStdout: (data) => {
      onDataStdoutResponseUuid = emitMessage(
        socket,
        userId,
        data,
        "buffer",
        onDataStdoutResponseUuid
      )
    },
  })
}
