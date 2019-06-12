//FIX ENDPOINTS
//ADD UPDATE FOLDERS AND NOTES FUNCTION TO ROUTER

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const folderRouter = require("../folders/folders-router");
const notesRouter = require("../notes/notes-router");
const app = express();

const morganOption = NODE_ENV === "production";
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use("/api/folders", folderRouter);
app.use("/api/notes", notesRouter);

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    next(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

// app.use(function errorHandler(err, req, res, next) {
//   if (res.headersSent && NODE_ENV === "production") {
//     return next(err);
//   }
//   res.status(500);
//   res.render("error", { error: err });
// });

module.exports = app;
