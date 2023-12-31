export const prepareResponseForWebapp = (
  response: string | Buffer,
  type: string,
  responseUuid?: string
) => {
  return {
    content: {
      value: response,
      type,
    },
    sender: "apapiai",
    timestamp: Date.now(),
    responseUuid,
  }
}
