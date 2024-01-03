import {
  buildMessage,
  storeFileForMessages,
  createAndRunThread,
} from "../../../controllers/openai"
import { getEconomicCalendarFromTE } from "../economic-calendar"
import { getQuote } from "../../../controllers/yfinance"
import { getTechnicalAnalysisFromBarchart } from "../technical-analysis"

export const getTradeDecision = async (symbol: string): Promise<string> => {
  // we retrieve economic calendar, live quotation and technical indicators
  const promises = [
    getEconomicCalendarFromTE(),
    getQuote({ symbol }),
    getTechnicalAnalysisFromBarchart(symbol),
  ]

  const [economicCalendarMarkdown, quotesJson, technicalIndicatorsMarkdown] =
    await Promise.all(promises)

  // we store the files for the assistant
  const filePromises = [
    storeFileForMessages(
      // @ts-ignore
      economicCalendarMarkdown.data,
      "economic-calendar.md"
    ),
    storeFileForMessages(JSON.stringify(quotesJson), "quotes"),
    storeFileForMessages(
      technicalIndicatorsMarkdown,
      "technical-indicators.md"
    ),
  ]

  const filePromiseResolved = await Promise.all(filePromises)

  // we build messages for the assistant
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

  // we ask an assistant to run the thread
  const response = await createAndRunThread(
    messages,
    "asst_2z9nK4QztZpUKcgCYIQIP3bc",
    "Check the files and messages of this thread. Also, check the files at assistant level. Then, make a trade decision.",
    {}
  )

  return response
}
