import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import SocketIO from "socket.io"
import cors from "cors"
import http from "http"
import path from "path"

import helloWorldRouter from "./routes/helloworld"
import chatRouter from "./routes/chat"
import yfinanceRouter from "./routes/yfinance"
import browseRouter from "./routes/browse"
import pluginsRouter from "./routes/plugins"
import openaiRouter from "./routes/openai"
import aiRouter from "./routes/ai"

const socketUsers = new Map<string, SocketIO.Socket>()

export const getSocket = (socketUuid: string) => socketUsers.get(socketUuid)

dotenv.config()

// start express
const app: Express = express()
app.use("*", cors())

// Register the bodyParser middleware here
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "../webapp/build")))

app.use("/helloworld", helloWorldRouter)
app.use("/chat", chatRouter)
app.use("/yfinance", yfinanceRouter)
app.use("/browse", browseRouter)
app.use("/plugins", pluginsRouter)
app.use("/openai", openaiRouter)
app.use("/ai", aiRouter)

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../webapp/build", "index.html"))
})

const server = new http.Server(app)

const io = new SocketIO.Server(server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  console.log("CONNECTION")
  const socketId = socket.id ?? ""
  socketUsers.set(socketId, socket)

  socket.emit("hello", socket.id)
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
