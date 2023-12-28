import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { io } from "socket.io-client"

export const socket = io("http://localhost:4000")

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const uuid = uuidv4()

  useEffect(() => {
    function onConnect() {
      setIsConnected(true)
      socket.emit("registerUuid", uuid)
    }

    function onDisconnect() {
      setIsConnected(false)
      socket.emit("unregisterUuid", uuid)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  return { isConnected }
}

export default useSocket
