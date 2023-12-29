import TwitterApi from "twitter-api-v2"
import dotenv from "dotenv"

import {
  getTwitterUser,
  setTwitterUser,
  setTwitterState,
} from "../routes/twitter"

dotenv.config()

const twitterClient = new TwitterApi({
  // @ts-ignore
  clientId: process.env.TWITTER_CLIENT_ID,
})

export const auth = (userId: string) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    process.env.TWITTER_CALLBACK_URL ?? "",
    { scope: ["tweet.read", "tweet.write"] }
  )
  setTwitterUser(userId, state)
  setTwitterState(state, { url, codeVerifier, state })
  return url
}

export const tweet = async (userId: string, message: string) => {
  try {
    const twitterUser = getTwitterUser(userId)
    const response = await twitterUser.loggedClient.v2.tweet(message)
    console.log("Tweet posté:", response)
    return response.data.text
  } catch (error) {
    console.log(error)
    return "Erreur lors de la publication du tweet"
  }
}
