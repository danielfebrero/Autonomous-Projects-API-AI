import puppeteer from "puppeteer"

import { vision } from "../../controllers/openai"
import { getQuote } from "../../controllers/yfinance"

export const getTechnicalIndicatorsFromInvestingAndMarketData = async (
  symbol: string
) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 2160, height: 2048 })

  await page.goto(`https://www.investing.com/currencies/${symbol}-technical`)

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
        "Identify and list the financial trading indicators including moving averages, technical indicators, and pivot points from the image provided. Return as a structured JSON object.",
    })
  } catch (error) {
    console.log(error)
  }

  const quotes = await getQuote({ symbol })

  console.log({
    responseFromGPT,
    originalTextFromInvesting: selectorContent,
    quotes,
  })

  return {
    responseFromGPT,
    quotes,
  }
}
