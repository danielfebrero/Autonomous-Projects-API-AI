import {
  buildMessage,
  storeFileForMessages,
  createAndRunThread,
} from "../../../controllers/openai"
import { getEconomicCalendarFromDailyFX } from "../economic-calendar"
import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../investing-technical-indicators"

export const getTradeDecision = async (symbol: string): Promise<string> => {
  const symbolForInvesting =
    symbol.slice(0, 3).toLowerCase() + "-" + symbol.slice(3).toLowerCase()

  const promises = [
    getEconomicCalendarFromDailyFX(),
    getTechnicalIndicatorsFromInvestingAndMarketData(symbolForInvesting),
  ]

  const [economicCalendarMarkdown, quotesAndTechnicalIndicatorsJson] =
    await Promise.all(promises)

  // @ts-ignore
  const { quotes: quotesJson, responseFromGPT: technicalIndicatorsJson } =
    quotesAndTechnicalIndicatorsJson

  const filePromises = [
    storeFileForMessages(
      // @ts-ignore
      economicCalendarMarkdown.data
    ),
    storeFileForMessages(quotesJson),
    storeFileForMessages(technicalIndicatorsJson),
  ]

  const filePromiseResolved = await Promise.all(filePromises)
  const messages = [
    buildMessage({
      textContent:
        "The attached file in this message is the economic calendar of this week",
      fileId: filePromiseResolved[0].id,
    }),
    buildMessage({
      textContent:
        "The attached file in this message is the real-time quotation of " +
        symbol,
      fileId: filePromiseResolved[1].id,
    }),
    buildMessage({
      textContent:
        "The attached file in this message is the real-time technical indicators of " +
        symbol,
      fileId: filePromiseResolved[2].id,
    }),
  ]

  const response = await createAndRunThread(
    messages,
    "asst_2z9nK4QztZpUKcgCYIQIP3bc",
    "Based on the files and data available in the messages and your own files, make a trade decision.",
    {}
  )

  return response
}
