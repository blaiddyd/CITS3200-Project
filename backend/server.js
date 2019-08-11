"use strict";

const express = require("express");
const next = require("next");
const helmet = require("helmet");
const cors = require("cors");

const port = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== "production";

const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();
const app = express();

// Mongoose connection and imports
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://cits3200team24:cits3200team24@cluster0-ekwzj.gcp.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function() {
  console.log("MongoDB server connected.");
});

// Unused models are required in index to load into memory
const Image = require("./models/imageModel");
const Project = require("./models/projectModel");

// Routers are imported after the model to avoid issues with mongoose
const apiRouter = require("./routers/apiRouter");

app.use(express.json());
app.use(helmet());
app.use(cors({ origin: true }));
app.use("/api", apiRouter);
app.get("*", (req, res) => nextHandler(req, res));

exports.startServer = async () => {
  await nextApp.prepare();

  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Server listening on port ${port}`);
  });
};

exports.app = app;
