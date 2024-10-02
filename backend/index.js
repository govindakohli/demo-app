import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./configuration/dataBase.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.js";

dotenv.config({ path: "./configuration/config.env" });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

connectDatabase();

import customerRouter from "./router/memberRouter.js";
import userRouter from "./router/userRouter.js";

// Use the router
app.use("/api", customerRouter);
app.use("/api", userRouter);

//error middleware
app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
