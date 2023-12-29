import { NodeHtmlMarkdown } from "node-html-markdown"

import { goto } from "../../controllers/browse"

export const getEconomicCalendar = async () => {
  const { page, browser } = await goto(
    `https://www.investing.com/economic-calendar/`
  )

  try {
    await page.waitForSelector("#onetrust-accept-btn-handler", {
      timeout: 5000,
    })
    await page.click("#onetrust-accept-btn-handler")
  } catch (error) {
    console.log(error)
  }

  var selectorContent

  try {
    const selector = await page.waitForSelector("#economicCalendarData")
    selectorContent = await selector?.evaluate((el) => el.outerHTML)
    await browser.close()
  } catch (error) {
    console.log(error)
  }

  return {
    data: NodeHtmlMarkdown.translate(selectorContent ?? ""),
  }
}
