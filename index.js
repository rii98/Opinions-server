const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
app.use(
  cors({
    origin: ["https://opinions-client.vercel.app", "http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/post", postRouter);
app.use("/auth", authRouter);
mongoose
  .connect(
    `mongodb+srv://riyajbhandari98:${MONGODB_PASSWORD}@opinion.bcqo14y.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((error) => {
    console.log(error);
  });

app.listen(PORT, () => {
  console.log("Live in port ", PORT);
});
