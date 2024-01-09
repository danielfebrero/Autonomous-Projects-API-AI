import { Request, Response, NextFunction } from "express"

import { authClient } from "../controllers/auth"

const googleSignin = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith("/twitter/callback")) {
    next()
    return
  }
  authClient(req.body.credential, req.body.appId)
    .then(async (userId) => {
      res.locals = { ...res.locals, userId }
      next()
    })
    .catch((err) => {
      res.status(500).json({
        message: "Could not connect to Google",
        error: err,
      })
    })
}

export default googleSignin
