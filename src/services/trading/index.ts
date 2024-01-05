import { getHistoricalData, getQuote } from "../../controllers/yfinance"

export const movingAverage = (
  data: number[],
  period: number
): number | undefined => {
  if (data.length < period) return undefined
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += data[i]
  }
  return sum / period
}

export const getTechnicalAnalysisCake = async ({
  symbol,
}: {
  symbol: string
}) => {
  const historicalDataRaw = await getHistoricalData({
    symbol,
  })

  const historicalData = JSON.parse(historicalDataRaw.content).reduce(
    (acc: number[], curr: { close: number }) => {
      acc.push(curr.close)
      return acc
    },
    [] as number[]
  )
  const movingAverage50 = movingAverage(historicalData.slice(-50), 50)

  console.log({ movingAverage50, len: historicalData.slice(-50).length })

  return {
    content: JSON.stringify({
      movingAverage: {
        200: movingAverage(historicalData.slice(-200), 200),
        100: movingAverage(historicalData.slice(-100), 100),
        50: movingAverage(historicalData.slice(-50), 50),
        20: movingAverage(historicalData.slice(-20), 20),
        5: movingAverage(historicalData.slice(-5), 5),
      },
    }),
    type: "json",
  }
}
