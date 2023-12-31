export const prepareResponseForWebapp = (
  response: string | Buffer,
  type: string,
  responseUuid?: string
) => {
  return {
    content: {
      value: Buffer.isBuffer(response) ? response.toString() : response,
      type,
    },
    sender: "apapiai",
    timestamp: Date.now(),
    responseUuid,
  }
}
