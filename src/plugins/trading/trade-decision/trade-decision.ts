import {
  buildMessage,
  storeFileForMessages,
  createAndRunThread,
} from "../../../controllers/openai"
import { getEconomicCalendarFromTE } from "../economic-calendar"
import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../investing-technical-indicators"

export const getTradeDecision = async (symbol: string): Promise<string> => {
  const symbolForInvesting =
    symbol.length === 6
      ? symbol.slice(0, 3).toLowerCase() + "-" + symbol.slice(3).toLowerCase()
      : symbol

  const promises = [
    getEconomicCalendarFromTE(),
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
      economicCalendarMarkdown.data,
      "economic-calendar.md"
    ),
    storeFileForMessages(JSON.stringify(quotesJson), "quotes"),
    storeFileForMessages(technicalIndicatorsJson, "technical-indicators"),
  ]

  const filePromiseResolved = await Promise.all(filePromises)
  const messages = [
    buildMessage({
      textContent:
        "The attached files in this message are the economic calendar of the week, the quotation, and the technical indicators for " +
        symbol +
        " now, " +
        new Date().toString(),
      fileIds: [
        filePromiseResolved[0].id,
        filePromiseResolved[1].id,
        filePromiseResolved[2].id,
      ],
    }),
  ]

  const response = await createAndRunThread(
    messages,
    "asst_2z9nK4QztZpUKcgCYIQIP3bc",
    "Check the files and messages of this thread. Also, check the files at assistant level. Then, make a trade decision.",
    {}
  )

  return response
}
