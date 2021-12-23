require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");
const path = require("path");
const app = express();

//initialazing database connection
const initDatabase = require("./database");

//using middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//using the routes
app.use(require("./routes/index.routes"));
app.use(require("./routes/auth.routes"));
app.use(require("./routes/profile.routes"));

app.use(express.static(path.join(__dirname, "build")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"), (err) => {
    if (err) {
      res.status(500).send("error");
      console.log(err);
    }
  });
});

//initialazing the server
let port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server started on port", port);
});
