import { spawn } from "child_process"

export const spawnCommand = ({
  command,
  args,
  onDataStdout,
  onDataStderr,
  onError,
  onClose,
}: {
  command: string
  args: string[]
  onDataStdout?: (data: Buffer) => void
  onDataStderr?: (data: Buffer) => void
  onError?: (error: Error) => void
  onClose?: (code: number) => void
}) => {
  const child = spawn(command, args)
  if (onDataStdout)
    child.stdout.on("data", onDataStdout as (...args: any[]) => void)
  if (onDataStderr)
    child.stderr.on("data", onDataStderr as (...args: any[]) => void)
  if (onError) child.on("error", onError as (...args: any[]) => void)
  if (onClose) child.on("close", onClose as (...args: any[]) => void)
  return child
}
