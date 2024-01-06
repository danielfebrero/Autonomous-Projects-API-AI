import { getHistoricalData } from "../../controllers/yfinance"

const williams = (
  dataClose: number[],
  dataHigh: number[],
  dataLow: number[]
) => {
  return (
    ((getHighestPrice(dataHigh) - dataClose.slice(-1)[0]) /
      (getHighestPrice(dataHigh) - getLowestPrice(dataLow))) *
    -100
  )
}

const movingAverage = (data: number[], period: number): number | undefined => {
  const refinedData = data.slice(-period)
  if (refinedData.length < period) return undefined
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += refinedData[i]
  }
  return sum / period
}

const rsi = (data: number[], period: number) => {
  const gain = data
    .slice(-period)
    .reverse()
    .reduce(
      (acc: number, curr: number, index: number, arr: number[]) =>
        arr[index + 1]
          ? curr > arr[index + 1]
            ? curr - arr[index + 1] + acc
            : acc
          : acc,
      0
    )
  const loss = data
    .slice(-period)
    .reverse()
    .reduce(
      (acc: number, curr: number, index: number, arr: number[]) =>
        arr[index + 1]
          ? curr < arr[index + 1]
            ? arr[index + 1] - curr + acc
            : acc
          : acc,
      0
    )
  const rs = gain / loss
  return 100 - 100 / (1 + rs)
}

const rawStochastic = (
  data: number[],
  dataHigh: number[],
  dataLow: number[],
  period: number
) => {
  return (
    (data.slice(-period).slice(-1)[0] -
      getLowestPrice(dataLow.slice(-period))) /
    (getHighestPrice(dataHigh.slice(-period)) -
      getLowestPrice(dataLow.slice(-period)))
  )
}

const getHighestPrice = (data: number[]) => {
  return data.reduce(
    (acc: number, curr: number) => (acc > curr ? acc : curr),
    0
  )
}

const getLowestPrice = (data: number[]) => {
  return data.reduce(
    (acc: number, curr: number) => (acc < curr ? acc : curr),
    data.slice(-1)[0]
  )
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

  const historicalDataHigh = JSON.parse(historicalDataRaw.content).reduce(
    (acc: number[], curr: { high: number }) => {
      acc.push(curr.high)
      return acc
    },
    [] as number[]
  )

  const historicalDataLow = JSON.parse(historicalDataRaw.content).reduce(
    (acc: number[], curr: { low: number }) => {
      acc.push(curr.low)
      return acc
    },
    [] as number[]
  )

  return {
    content: JSON.stringify({
      williams: {
        "14days": williams(
          historicalData,
          historicalDataHigh,
          historicalDataLow
        ),
      },
      movingAverage: {
        "5days": movingAverage(historicalData, 5),
        "20days": movingAverage(historicalData, 20),
        "50days": movingAverage(historicalData, 50),
        "100days": movingAverage(historicalData, 100),
        "200days": movingAverage(historicalData, 200),
      },
      rsi: {
        "9days": rsi(historicalData, 9),
        "14days": rsi(historicalData, 14),
        "20days": rsi(historicalData, 20),
        "50days": rsi(historicalData, 50),
        "100days": rsi(historicalData, 100),
      },
      rawStochastic: {
        "9days": rawStochastic(
          historicalData,
          historicalDataHigh,
          historicalDataLow,
          9
        ),
        "14days": rawStochastic(
          historicalData,
          historicalDataHigh,
          historicalDataLow,
          14
        ),
        "20days": rawStochastic(
          historicalData,
          historicalDataHigh,
          historicalDataLow,
          20
        ),
        "50days": rawStochastic(
          historicalData,
          historicalDataHigh,
          historicalDataLow,
          50
        ),
        "1OOdays": rawStochastic(
          historicalData,
          historicalDataHigh,
          historicalDataLow,
          100
        ),
      },
    }),
    type: "json",
  }
}
