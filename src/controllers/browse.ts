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
  await page.setExtraHTTPHeaders({
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    "upgrade-insecure-requests": "1",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,en;q=0.8",
  })

  await page.goto(url)

  await new Promise((r: any) =>
    setTimeout(r, Math.floor(Math.random() * 5 * 1000))
  )

  const selected = selector
    ? await page.waitForSelector(selector)
    : await page.waitForSelector("html")

  const img = selected ? await selected?.screenshot() : await page.screenshot()
  const base64 = img?.toString("base64")

  const selectorContent = await selected?.evaluate((el) => el.textContent)
  await browser.close()

  return { img: base64, text: selectorContent }
}
