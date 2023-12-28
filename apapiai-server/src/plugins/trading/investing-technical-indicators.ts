import puppeteer from "puppeteer"

import { vision } from "../../controllers/openai"

export const getTechnicalIndicatorsFromInvesting = async (symbol: string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 2160, height: 2048 })

  await page.goto(`https://www.investing.com/currencies/${symbol}-technical`)

  await page.waitForSelector("#onetrust-accept-btn-handler")
  await page.click("#onetrust-accept-btn-handler")

  const selector = await page.waitForSelector("#techinalContent")
  const img = await selector?.screenshot()
  const base64 = img?.toString("base64") ?? ""
  const selectorContent = await selector?.evaluate((el) => el.textContent)

  await browser.close()

  const response = await vision({
    base64,
    instruction:
      "Identify and list the financial trading indicators including moving averages, technical indicators, and pivot points from the image provided. Return as a structured JSON object.",
  })

  return { response, originalText: selectorContent }
}
