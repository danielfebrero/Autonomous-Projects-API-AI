import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"

import helloWorldRouter from "./routes/helloworld"
import chatRouter from "./routes/chat"
import yfinanceRouter from "./routes/yfinance"
import browseRouter from "./routes/browse"
import pluginsRouter from "./routes/plugins"
import openaiRouter from "./routes/openai"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

// ✅ Register the bodyParser middleware here
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
