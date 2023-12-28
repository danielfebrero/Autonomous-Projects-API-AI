export const prepareResponse = (response: string | string[]) => {
  return {
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: Array.isArray(response) ? response : [response],
          },
        },
      ],
    },
  }
}
