import TwitterApi from "twitter-api-v2"

import {
  getTwitterStateByUserId,
  setTwitterStateByUserId,
  getTwitterUserByState,
  setTwitterUserByState,
} from "../routes/twitter"

const twitterClient = new TwitterApi({
  // @ts-ignore
  clientId: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
  // appKey: process.env.TWITTER_APP_KEY,
  // appSecret: process.env.TWITTER_APP_SECRET,
})

export const auth = (userId: string) => {
  const { url, codeVerifier, state } = twitterClient.generateOAuth2AuthLink(
    process.env.TWITTER_CALLBACK_URL ?? "",
    { scope: ["tweet.read", "tweet.write", "users.read"] }
  )
  setTwitterStateByUserId(userId, state)
  setTwitterUserByState(state, { url, codeVerifier, state })
  return url
}

export const tweet = async (userId: string, message: string) => {
  try {
    const state = getTwitterStateByUserId(userId ?? "")
    const twitterUser = getTwitterUserByState(state ?? "")
    const response = await twitterUser.loggedClient.v2.tweet(message)
    console.log("Tweet posté:", response)
    return response.data.text
  } catch (error) {
    console.log(error)
    return "Erreur lors de la publication du tweet"
  }
}
