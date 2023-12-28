import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { io } from "socket.io-client"

export const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://bard-407521.uc.r.appspot.com"
)

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [socketUuid, setSocketUuid] = useState(uuidv4())

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
      socket.emit("registerUuid", socketUuid)
    }

    function onDisconnect() {
      setIsConnected(false)
      socket.emit("unregisterUuid", socketUuid)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  return { isConnected, socketUuid, socket }
}

export default useSocket
