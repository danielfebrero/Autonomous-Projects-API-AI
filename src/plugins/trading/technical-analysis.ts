import { NodeHtmlMarkdown } from "node-html-markdown"

import { goto } from "../../controllers/browse"
import { vision } from "../../controllers/openai"

export const getTechnicalAnalysisFromInvesting = async (symbol: string) => {
  return new Promise(async (resolve, reject) => {
    const { page, browser } = await goto(
      `https://www.investing.com/currencies/${symbol}-technical`
    )

    try {
      await page.waitForSelector("#onetrust-accept-btn-handler", {
        timeout: 5000,
      })
      await page.click("#onetrust-accept-btn-handler")
    } catch (error) {
      console.log(error)
    }

    var responseFromGPT, selectorContent

    try {
      const selector = await page.waitForSelector("#techinalContent")
      const img = await selector?.screenshot()
      const base64 = img?.toString("base64") ?? ""
      selectorContent = await selector?.evaluate((el) => el.textContent)

      await browser.close()

      responseFromGPT = await vision({
        base64,
        instruction:
          "Identify and list the financial trading indicators including moving averages, technical indicators, and pivot points from the image provided. Return as a structured JSON object and nothing more.",
      })
      resolve(responseFromGPT)
    } catch (error) {
      reject(error)
    }
  })
}

export const getTechnicalAnalysisFromBarchart = async (symbol: string) => {
  return new Promise(async (resolve, reject) => {
    const { page, browser } = await goto(
      `https://www.barchart.com/forex/quotes/%5E${symbol}/technical-analysis`
    )

    try {
      const selector = await page.waitForSelector(".bc-technical-analysis")
      const selectorContent = await selector?.evaluate((el) => el.outerHTML)

      await browser.close()

      resolve(NodeHtmlMarkdown.translate(selectorContent ?? ""))
    } catch (error) {
      reject(error)
    }
  })
}
