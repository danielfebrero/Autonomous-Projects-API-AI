import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"

import helloWorldRouter from "./routes/helloworld"

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server")
})

app.use("/helloworld", helloWorldRouter)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
