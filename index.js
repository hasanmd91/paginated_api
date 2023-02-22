const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
const user = require("./users");
const mongoose = require("mongoose");

// Set up middleware to parse requests
app.use(bodyparser.json({ limit: "30mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/pagination");
mongoose.set("strictQuery", true);
const db = mongoose.connection;
db.once("open", async () => {
  if ((await user.countDocuments().exec()) > 0) return;
  Promise.all([
    user.create({ name: "name 1" }),
    user.create({ name: "name 2" }),
    user.create({ name: "name 3" }),
    user.create({ name: "name 4" }),
    user.create({ name: "name 5" }),
    user.create({ name: "name 6" }),
    user.create({ name: "name 7" }),
    user.create({ name: "name 8" }),
    user.create({ name: "name 9" }),
    user.create({ name: "name 10" }),
    user.create({ name: "name 11" }),
    user.create({ name: "name 12" }),
    user.create({ name: "name 13" }),
    user.create({ name: "name 13" }),
    user.create({ name: "name 15" }),
    user.create({ name: "name 16" }),
    user.create({ name: "name 17" }),
    user.create({ name: "name 18" }),
    user.create({ name: "name 19" }),
    user.create({ name: "name 20" }),
    user.create({ name: "name 21" }),
    user.create({ name: "name 22" }),
  ]).then(() => console.log("added users"));
});

app.get("/users", paginatedResults(user), (req, res) => {
  res.json(results);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 5;

    startIndex = (page - 1) * limit;
    endIndex = page * limit;

    results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

app.listen(5000, () => console.log("app is listening on port 5000 "));
