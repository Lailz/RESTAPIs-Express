const express = require("express");
const app = express();
const routes = require("./routes");

// Express middleware: When a request comes in it'll be sent through this function before it hits one of our route handlers..
// This middleware tells Express that we're expecting requests to come in as JSON.
// That way, Express can take the JSON we've sent, via the request body, and make it available to us in the request object on the property called body.
// (Parses the incoming JSON object so that the data from the request is available on req.body)
app.use(express.json());
app.use("/api", routes);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(3000, () => console.log("Quote API listening on port 3000!"));
