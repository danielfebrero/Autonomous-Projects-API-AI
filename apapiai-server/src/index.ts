import dotenv from "dotenv"

import { startIO } from "./services/socket"
import { startExpress } from "./services/express"

dotenv.config()

startExpress()
startIO()
