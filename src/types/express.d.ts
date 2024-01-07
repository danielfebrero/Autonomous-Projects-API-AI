import { Request } from "express"

export type RequestCake = Request & {
  calculatedData: {
    [key: string]: any
  }
}
