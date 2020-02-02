const express = require("express");
const router = express.Router();
const records = require("../records");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

router.get(
  "/quotes",
  asyncHandler(async (req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
  })
);

router.get(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      res.json(quote);
    } else {
      res.status(404).json({ message: "quote not found!" });
    }
  })
);

router.get(
  "/quotes/quote/random",
  asyncHandler(async (req, res) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
  })
);

router.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    console.log("author w quote", req.body);
    if (req.body.author && req.body.quote) {
      const newQuote = await records.createQuote({
        quote: req.body.quote,
        author: req.body.author
      });
      res.status(201).json(newQuote);
    } else {
      res.status(400).json({ message: "missing information!" });
    }
  })
);

router.put(
  "/quotes/:id",
  asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      quote.quote = req.body.quote;
      quote.author = req.body.author;

      await records.updateQuote(quote);
      res.status(204).end(); //for put request, the convention is to simply not send anything back. So we basically send back a status code to indicate that the update went as expected
      // we use .end() to end the response or basically the app will be stuck which simply tells Express that we're done
    } else {
      res.status(400).json({ message: "Quote Not Found!" });
    }
  })
);

router.delete(
  "/quotes/:id",
  asyncHandler(async (req, res, next) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
      await records.deleteQuote(quote);
      res.status(204).end();
    } else {
      res.status(400).json({ message: "Quote Not Found!" });
    }
  })
);

module.exports = router;
