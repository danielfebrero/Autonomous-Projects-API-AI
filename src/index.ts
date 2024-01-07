import "dotenv/config"
import express, { Express } from "express"
import bodyParser from "body-parser"
import SocketIO from "socket.io"
import cors from "cors"
import http from "http"
import path from "path"

import chatRouter from "./routes/chat"
import browseRouter from "./routes/browse"
import openaiRouter from "./routes/openai"
import aiRouter from "./routes/ai"
import twitterRouter from "./routes/twitter"
import unixRouter from "./routes/unix"
import trading from "./routes/trading"
import googleSignin from "./middlewares/googlesignin"

const socketUsers = new Map<string, SocketIO.Socket>()

export const getSocket = (socketUuid: string) => socketUsers.get(socketUuid)

const app: Express = express()

// middlewares
app.use("*", cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use(googleSignin)

// routers
app.use(express.static(path.join(__dirname, "../webapp/build"))) // Serve the static files from the React app
app.use("/chat", chatRouter)
app.use("/browse", browseRouter)
app.use("/openai", openaiRouter)
app.use("/ai", aiRouter)
app.use("/twitter", twitterRouter)
app.use("/unix", unixRouter)
app.use("/trading", trading)

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../webapp/build", "index.html"))
})

const server = new http.Server(app)

const io = new SocketIO.Server(server, {
  connectionStateRecovery: {},
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("CONNECTION")
  const socketId = socket.id ?? ""
  socketUsers.set(socketId, socket)

  socket.emit("hello", socketId)
  console.log({ socketId })

  socket.on("unregisterUuid", (uuid) => {
    socketUsers.delete(socketId)
  })

  socket.on("disconnect", () => {
    socketUsers.delete(socketId)
  })
})

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
