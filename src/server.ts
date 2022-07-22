import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoute from "./route/authRoute";
import friendRoute from "./route/friend-invitation";
import { registerSocketServer } from "./socket";

dotenv.config();

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/friend-invitation", friendRoute);

const server = http.createServer(app);
registerSocketServer(server);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() =>
    server.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}`)
    )
  )
  .catch((err) => console.log(err));
