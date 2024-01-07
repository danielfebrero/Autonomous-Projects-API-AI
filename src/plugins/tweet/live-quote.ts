import { chat } from "../../controllers/openai"
import { tweet } from "../../controllers/twitter"
import { getQuote } from "../../controllers/yfinance"

export const tweetLiveQuote = async ({
  userId,
  symbol,
}: {
  userId: string
  symbol: string
}): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    // 1. Get quote
    const quote = await getQuote({ symbol })

    // 2. Summurize it
    const gptResponse = await chat({
      instruction:
        "Summarize this realtime quotation in a tweet of max 280 characters. Only response with the tweet content.\n\nQuote:\n" +
        quote.content,
    })

    // 3. Tweet it
    if (gptResponse) {
      await tweet(userId, gptResponse as string)
      resolve(gptResponse as string)
    } else {
      reject("No gpt response")
    }
  })
}
