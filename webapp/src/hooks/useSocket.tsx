import { useState, useEffect } from "react"
import { io } from "socket.io-client"

export const socket = io(
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "https://apt-leman.darkeccho.com"
)

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [socketUuid, setSocketUuid] = useState("")

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
    }

    function onDisconnect() {
      setIsConnected(false)
      socket.emit("unregisterUuid", socketUuid)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("hello", setSocketUuid)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  return { isConnected, socketUuid, socket }
}

export default useSocket
