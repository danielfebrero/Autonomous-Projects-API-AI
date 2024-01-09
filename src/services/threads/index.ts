const threadsByUsers = new Map<string, string>()

export const getThread = (userId: string) => {
  return threadsByUsers.get(userId)
}

export const setThread = (userId: string, threadId: string) => {
  threadsByUsers.set(userId, threadId)
}

export const removeThread = (userId: string) => {
  threadsByUsers.delete(userId)
}
