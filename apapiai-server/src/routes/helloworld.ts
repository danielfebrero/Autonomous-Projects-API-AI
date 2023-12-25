import express from "express";
const router = express.Router();

router.get("/", (req, res, next) => {
  const response = {
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: ["Hello, world from the server!"],
          },
        },
      ],
    },
  };
  res.json(response);
});

router.post("/", (req, res, next) => {
  const response = {
    fulfillmentResponse: {
      messages: [
        {
          text: {
            text: ["Hello, world from the server!"],
          },
        },
      ],
    },
  };
  res.json(response);
});

export default router;
