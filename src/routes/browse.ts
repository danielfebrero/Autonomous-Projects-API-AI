import express from "express"
import { browse } from "../controllers/browse"
const router = express.Router()

router.post("/", (req, res, next) => {
  browse({ url: req.body.url, selector: req.body.selector })
    .then((response) => res.status(200).json(response))
    .catch((err: any) => res.status(500).send(err))
})

export default router
