import { Request } from "express"

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export type RequestCake = Request & {
  calculatedData: {
    [key: string]: any
  }
}
