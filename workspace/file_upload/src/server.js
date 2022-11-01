const cors = require("cors");
const express = require("express");
const initRoutes = require("./routes");

const app = express();
const port = 8080;

global.__basedir = __dirname;

app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

app.use(express.urlencoded({ extended: true }));

initRoutes(app);

app.listen(port, () => {
  console.log(`Running at localhost:${port}`);
});
