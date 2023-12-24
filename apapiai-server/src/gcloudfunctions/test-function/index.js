const functions = require('@google-cloud/functions-framework');

// Register an HTTP function with the Functions Framework that will be executed
// when you make an HTTP request to the deployed function's endpoint.
functions.http('dialogflowCXWebhook', (req, res) => {
  // Get the request body from the request.
  const body = req.body;

  // Get the session ID from the request.
  const sessionId = body.sessionInfo.sessionId;

  // Get the current page from the request.
  const currentPage = body.currentPage.displayName;

  // Get the user's latest input from the request.
  const userInput = body.queryResult.transcript;

  // Process the user's input and generate a response.
  const response = {
    fulfillmentMessages: [
      {
        text: {
          text: ['Hello, World!'],
        },
      },
    ],
  };

  // Send the response to Dialogflow CX.
  res.send(response);
});
