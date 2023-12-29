import yahooFinance from "yahoo-finance2"

export const getHistoricalData = async ({
  symbol,
  period1,
  period2,
}: {
  symbol: string
  period1?: string
  period2?: string
}) => {
  const search = await yahooFinance.search(symbol)
  const selectedSymbol = search.quotes[0].symbol
  const historical = await yahooFinance.historical(selectedSymbol, {
    period1: period1 ?? "2022-01-01",
    period2: period2 ?? new Date().toISOString().split("T")[0],
  })

  return historical
}

export const getQuote = async ({ symbol }: { symbol: string }) => {
  const search = await yahooFinance.search(symbol)
  const selectedSymbol = search.quotes[0].symbol
  const quote = await yahooFinance.quote(selectedSymbol)

  return quote
}

export const getInsights = async ({
  symbol,
  lang,
  reportsCount,
  region,
}: {
  symbol: string
  lang: string
  reportsCount?: number
  region?: string
}) => {
  const search = await yahooFinance.search(symbol)
  const selectedSymbol = search.quotes[0].symbol
  const insights = await yahooFinance.insights(selectedSymbol, {
    lang: lang ?? "en-US",
    reportsCount: reportsCount ?? 2,
    region: region ?? "US",
  })

  return insights
}
