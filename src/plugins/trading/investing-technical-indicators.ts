import { vision } from "../../controllers/openai"
import { getQuote } from "../../controllers/yfinance"
import { goto } from "../../controllers/browse"

export const getTechnicalIndicatorsFromInvestingAndMarketData = async (
  symbol: string
) => {
  const technicalIndicatorsFromInvesting = async () => {
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

  const [quotes, responseFromGPT] = await Promise.all([
    getQuote({ symbol }),
    technicalIndicatorsFromInvesting(),
  ])

  return {
    responseFromGPT,
    quotes,
  }
}
