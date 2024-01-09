import { OAuth2Client } from "google-auth-library"

export const authClient = async (
  idToken: string,
  audience: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = new OAuth2Client()
      const ticket = await client.verifyIdToken({
        idToken,
        audience,
      })
      const payload = ticket.getPayload()
      const userId = payload?.["sub"]
      if (userId) resolve(userId)
      else reject("User not found")
    } catch (e) {
      reject(e)
    }
  })
}
