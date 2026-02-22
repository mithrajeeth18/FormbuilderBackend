const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const requestLogger = require("./middlewares/requestLogger");
const securityHeaders = require("./middlewares/securityHeaders");
const rateLimit = require("./middlewares/rateLimit");
const env = require("./config/env");

const app = express();

app.set("trust proxy", 1);
app.use(requestLogger);
app.use(securityHeaders);
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.FRONTEND_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
  })
);
app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  })
);
app.use(express.json({ limit: env.JSON_BODY_LIMIT }));

app.use(routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
