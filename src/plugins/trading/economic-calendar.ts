import puppeteer from "puppeteer"
import { NodeHtmlMarkdown } from "node-html-markdown"

export const getEconomicCalendar = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 2160, height: 2048 })

  await page.goto(`https://www.investing.com/economic-calendar/`)

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
    const selector = await page.waitForSelector("#economicCalendarData")

    selectorContent = await selector?.evaluate((el) => el.outerHTML)

    await browser.close()
  } catch (error) {
    console.log(error)
  }

  console.log({
    responseFromGPT,
    originalTextFromInvesting: selectorContent,
  })

  return {
    data: NodeHtmlMarkdown.translate(selectorContent ?? ""),
  }
}
