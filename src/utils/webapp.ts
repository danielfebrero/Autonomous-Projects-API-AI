export const prepareResponseForWebapp = (
  response: string,
  type: string,
  pendingTaskId?: string
) => {
  return {
    content: {
      value: response,
      type,
    },
    sender: "apapiai",
    timestamp: Date.now(),
    pendingTaskId,
  }
}
