const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

mongoose.connect("mongodb://root:test@localhost:27017/test?authSource=admin");

app.listen(3000, () => {
  console.log("app listen on port 3000");
});