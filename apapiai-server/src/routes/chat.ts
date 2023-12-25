import express from "express"
import cors from "cors"
import { authClient } from "../controllers/auth"
import dotenv from "dotenv"

const router = express.Router()
dotenv.config()

//Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
  methods: "GET,POST",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
}

router.use("/", cors(corsOptions))

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.post("/", (req, res) => {
  authClient(req.body.user.credential, req.body.app_id)
    .then((response) => {
      console.log(response)
      res.send(response)
    })
    .catch((error) => {
      console.log(error)
      res.send(error)
    })
})

export default router
