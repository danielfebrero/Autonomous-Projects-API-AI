import { getLastAgentResponseByUser } from "../routes/chat"

export const includeLastMessage = (
  userId: string,
  instruction: string,
  replace?: boolean
) => {
  var finalInstruction = instruction
  if (replace) {
    finalInstruction = finalInstruction.replace(
      "ton dernier message",
      `ce texte : """${getLastAgentResponseByUser(userId ?? "")}"""`
    )
  } else {
    finalInstruction += "\n\n---\n\n" + getLastAgentResponseByUser(userId ?? "")
  }

  return finalInstruction
}
