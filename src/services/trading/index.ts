import { getHistoricalData } from "../../controllers/yfinance"

const ema = (data: number[], period: number) => {
  const alpha = 2 / (period + 1)
  let ema = []

  // Initialiser avec la première donnée de prix
  ema[0] = data[0]

  // Calculer la EMA pour le reste des données
  for (let i = 1; i < data.length; i++) {
    ema[i] = data[i] * alpha + ema[i - 1] * (1 - alpha)
  }

  return ema
}

const macd = (data: number[], ema1: number[], ema2: number[]) => {
  // Soustraire la EMA26 de la EMA12 pour obtenir la ligne MACD
  const macdLine = ema1.map((value, index) => value - ema2[index])

  // Calculer la EMA de 9 jours pour la ligne MACD pour obtenir la ligne de signal
  const signalLine = ema(macdLine, 9)

  // La dernière valeur du MACD est la différence entre la dernière valeur de la ligne MACD et de la ligne de signal
  const macdValue =
    macdLine[macdLine.length - 1] - signalLine[signalLine.length - 1]

  return macdValue
}

const atr = (
  data: { high: number; low: number; close: number }[],
  period: number
) => {
  let trueRanges = []

  for (let i = 1; i < data.length; i++) {
    let high = data[i].high
    let low = data[i].low
    let previousClose = data[i - 1].close

    let tr1 = high - low
    let tr2 = Math.abs(high - previousClose)
    let tr3 = Math.abs(low - previousClose)

    let trueRange = Math.max(tr1, tr2, tr3)
    trueRanges.push(trueRange)
  }

  // Calculate the ATR only if we have enough true range values
  if (trueRanges.length >= period) {
    let sum = trueRanges.slice(-period).reduce((a, b) => a + b, 0)
    return sum / period
  } else {
    return null // Not enough data to calculate ATR
  }
}

const cci = (
  data: { high: number; low: number; close: number }[],
  period: number
) => {
  const PT = data.slice(-period).map((d) => (d.high + d.low + d.close) / 3)
  const MMS = []
  for (let i = 0; i < PT.length; i++) {
    if (i >= period - 1) {
      let sum = 0
      for (let j = i; j > i - period; j--) {
        sum += PT[j]
      }
      MMS.push(sum / period)
    } else {
      MMS.push(null)
    }
  }

  const meanDeviation = []
  for (let i = 0; i < PT.length; i++) {
    if (i >= period - 1) {
      let sumDeviation = 0
      for (let j = i; j > i - period; j--) {
        sumDeviation += Math.abs(PT[j] - (MMS[i] || 0))
      }
      meanDeviation.push(sumDeviation / period)
    } else {
      meanDeviation.push(null)
    }
  }

  const CCI = []
  for (let i = 0; i < PT.length; i++) {
    if (MMS[i] !== null && meanDeviation[i] !== null) {
      let cci = (PT[i] - (MMS[i] || 0)) / (0.015 * (meanDeviation[i] || 0))
      CCI.push(cci)
    } else {
      CCI.push(null)
    }
  }

  return CCI.filter((cci) => cci !== null).slice(-1)[0]
}

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

  const historicalDataClose = JSON.parse(historicalDataRaw.content).reduce(
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
      MACD: {
        "12,26": macd(
          historicalDataClose,
          ema(historicalDataClose, 12),
          ema(historicalDataClose, 26)
        ),
      },
      williams: {
        "14days": williams(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow
        ),
      },
      movingAverage: {
        "5days": movingAverage(historicalDataClose, 5),
        "20days": movingAverage(historicalDataClose, 20),
        "50days": movingAverage(historicalDataClose, 50),
        "100days": movingAverage(historicalDataClose, 100),
        "200days": movingAverage(historicalDataClose, 200),
      },
      RSI: {
        "9days": rsi(historicalDataClose, 9),
        "14days": rsi(historicalDataClose, 14),
        "20days": rsi(historicalDataClose, 20),
        "50days": rsi(historicalDataClose, 50),
        "100days": rsi(historicalDataClose, 100),
      },
      CCI: {
        "9days": cci(JSON.parse(historicalDataRaw.content), 9),
        "14days": cci(JSON.parse(historicalDataRaw.content), 14),
        "20days": cci(JSON.parse(historicalDataRaw.content), 20),
        "50days": cci(JSON.parse(historicalDataRaw.content), 50),
        "100days": cci(JSON.parse(historicalDataRaw.content), 100),
      },
      ATR: {
        "9days": atr(JSON.parse(historicalDataRaw.content), 9),
        "14days": atr(JSON.parse(historicalDataRaw.content), 14),
        "20days": atr(JSON.parse(historicalDataRaw.content), 20),
        "50days": atr(JSON.parse(historicalDataRaw.content), 50),
        "100days": atr(JSON.parse(historicalDataRaw.content), 100),
      },
      rawStochastic: {
        "9days": rawStochastic(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow,
          9
        ),
        "14days": rawStochastic(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow,
          14
        ),
        "20days": rawStochastic(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow,
          20
        ),
        "50days": rawStochastic(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow,
          50
        ),
        "1OOdays": rawStochastic(
          historicalDataClose,
          historicalDataHigh,
          historicalDataLow,
          100
        ),
      },
    }),
    type: "json",
  }
}
