import puppeteer from "puppeteer"

export const browse = async ({
  url,
  selector,
}: {
  url: string
  selector?: string
}) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 2160, height: 2048 })

  await page.goto(url)

  const selected = selector
    ? await page.waitForSelector(selector)
    : await page.waitForSelector("html")

  const img = selected ? await selected?.screenshot() : await page.screenshot()
  const base64 = img?.toString("base64")

  const selectorContent = await selected?.evaluate((el) => el.textContent)
  await browser.close()

  return { img: base64, text: selectorContent }
}
