const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const path = require("path");

const app = express();

require("./database");

app.use(cors());
app.use(express.json());
app.use(
  "/fotos",
  express.static(path.resolve(__dirname, "..", "uploads", "profile"))
);
app.use(routes);
module.exports = app;
