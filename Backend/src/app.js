const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Trust reverse proxy (Render / Netlify / Heroku) for secure cookies
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://tubular-klepon-903685.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.endsWith(".netlify.app")) {
      return callback(null, true);
    }
    return callback(new Error("CORS policy violation: origin not allowed"), false);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

//! require all the routes here
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

//! using all the routes here
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
