import {
  buildMessage,
  storeFileForMessages,
  createAndRunThread,
} from "../../../controllers/openai"
import { getEconomicCalendarFromTE } from "../economic-calendar"
import { getQuote } from "../../../controllers/yfinance"
import { getTechnicalAnalysisFromBarchart } from "../technical-analysis"

export const getTradeDecision = async ({ symbol }: { symbol: string }) => {
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
      economicCalendarMarkdown.content,
      "economic-calendar.md"
    ),
  ]

  const filePromiseResolved = await Promise.all(filePromises)

  const textContent =
    "The attached files in this message is the economic calendar of the week for " +
    symbol +
    " now, " +
    new Date().toString() +
    ". This is the live quotation of the symbol: \n" +
    JSON.stringify(quotesJson.content) +
    "\n And this is the technical analysis of the symbol: \n" +
    technicalIndicatorsMarkdown.content

  console.log({ textContent })

  // we build messages for the assistant
  const messages = [
    buildMessage({
      textContent,
      fileIds: [filePromiseResolved[0].id],
    }),
  ]

  // we ask an assistant to run the thread
  const response = await createAndRunThread(
    messages,
    "asst_2z9nK4QztZpUKcgCYIQIP3bc",
    "Check the files and messages of this thread. Also, check the files at assistant level. Then, make a trade decision for short, mid and long term. Provide a trade decision for intraday trading (entry price, stop loss, take profit, etc.). Answer with one message only in a structured markdown way.",
    {}
  )

  return { content: response, type: "markdown" }
}
