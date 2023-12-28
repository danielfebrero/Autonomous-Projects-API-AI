import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"
import bodyParser from "body-parser"
import SocketIO from "socket.io"
import cors from "cors"
import http from "http"

import helloWorldRouter from "./routes/helloworld"
import chatRouter from "./routes/chat"
import yfinanceRouter from "./routes/yfinance"
import browseRouter from "./routes/browse"
import pluginsRouter from "./routes/plugins"
import openaiRouter from "./routes/openai"

const socketUsers: any = {}
const uuidsMapping: any = {}

export const getSocket = (socketUuid: string) => socketUsers[socketUuid]

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

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

app.use("/helloworld", helloWorldRouter)
app.use("/chat", chatRouter)
app.use("/yfinance", yfinanceRouter)
app.use("/browse", browseRouter)
app.use("/plugins", pluginsRouter)
app.use("/openai", openaiRouter)

const server = new http.Server(app)

const io = new SocketIO.Server(server, {
  cors: {
    origin: "*",
  },
})

io.on("connection", (socket) => {
  const socketId = socket.id ?? ""

  socket.on("registerUuid", (uuid) => {
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

const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
