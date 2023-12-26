const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const postRouter = require("./routes/Post");
require("dotenv").config();
const PORT = process.env.PORT;
const app = express();
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/post", postRouter);
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
