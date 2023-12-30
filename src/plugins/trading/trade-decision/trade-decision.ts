import { storeFileAtAssistant } from "../../../controllers/openai"
import { getEconomicCalendarFromDailyFX } from "../economic-calendar"
import { getTechnicalIndicatorsFromInvestingAndMarketData } from "../investing-technical-indicators"

export const tradeDecision = async (symbol: string) => {
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
    storeFileAtAssistant(
      // @ts-ignore
      economicCalendarMarkdown.data,
      "asst_2z9nK4QztZpUKcgCYIQIP3bc"
    ),
    storeFileAtAssistant(quotesJson, "asst_2z9nK4QztZpUKcgCYIQIP3bc"),
    storeFileAtAssistant(
      technicalIndicatorsJson,
      "asst_2z9nK4QztZpUKcgCYIQIP3bc"
    ),
  ]

  const filePromiseResolved = await Promise.all(filePromises)

  // TODO: create messages then pass them to the magical function
}
