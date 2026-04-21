import express from "express";
import dotenv from "dotenv";
import groupRoutes from "./routes/groupRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Expense Splitter API is running");
});

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

app.get("/version", (_req, res) => {
  res.status(200).json({
    version: process.env.APP_VERSION || "1.0.0"
  });
});

app.use("/groups", groupRoutes);

export default app;