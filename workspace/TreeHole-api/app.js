const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./router");
const errorHandler = require("./middleware/error-handler");
const expressJWT = require("express-jwt");
const { config } = require("./util");
require("./model");

const app = express();

app.use(
  expressJWT({
    secret: config.secretKey,
    algorithms: ["HS256"],
  }).unless({
    path: ["/user/login", "/user/register"],
  })
);

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);

app.use(errorHandler());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://lorsaclhost:${PORT}`);
});
