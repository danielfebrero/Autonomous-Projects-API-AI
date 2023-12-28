import { Server } from "socket.io"
import http from "http"

// start websocket
const server = http.createServer()
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

const socketUsers: any = {}
const uuidsMapping: any = {}

export const getSocket = (socketUuid: string) => socketUsers[socketUuid]

export const startIO = () => {
  io.on("connection", (socket) => {
    const socketId = socket.id ?? ""

    socket.on("registerUuid", (uuid) => {
      console.log("registerUuid", uuid)
      socketUsers[uuid] = socket
      uuidsMapping[socketId] = uuid
    })

    socket.on("unregisterUuid", (uuid) => {
      delete socketUsers[uuid]
      delete uuidsMapping[socketId]
    })

    socket.on("disconnect", () => {
      delete socketUsers[uuidsMapping[socketId]]
      delete uuidsMapping[socketId]
    })
  })

  server.listen(4000, () => {
    console.log("listening on *:4000")
  })
}
