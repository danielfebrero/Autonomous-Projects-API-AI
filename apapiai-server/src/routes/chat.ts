import express from "express"
import cors from "cors"

const router = express.Router()

//Configure CORS
const corsOptions = {
  origin:
    process.env.NODE_ENV === "development" ? "*" : process.env.CORS_ORIGIN,
  methods: "GET,POST",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
}

router.use("/", cors(corsOptions))

router.get("/", (req, res) => {
  res.send("Hello World")
})

router.post("/", (req, res) => {
  res.send("Hello World")
})

export default router
