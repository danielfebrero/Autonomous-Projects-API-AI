import { OAuth2Client } from "google-auth-library"

export const authClient = async (
  idToken: string,
  audience: string
): Promise<string | undefined> => {
  const client = new OAuth2Client()
  const ticket = await client.verifyIdToken({
    idToken,
    audience,
  })
  const payload = ticket.getPayload()
  const userid = payload?.["sub"]
  return userid
}
