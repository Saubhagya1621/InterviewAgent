import express from "express";
import cors from "cors";
import interviewRoutes from "./routes/interview.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", interviewRoutes);

app.use(errorHandler);

export { app };
