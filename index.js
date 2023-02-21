const express = require("express");
const app = express();
const user = require("./users");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pagination");
mongoose.set("strictQuery", false);
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
  ]).then(() => console.log("added users"));
});

app.get("/users", paginatedResults(user), (req, res) => {
  res.json(results);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = +req.query.page;
    const limit = +req.query.limit;

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

app.listen(3000, () => console.log("app is listening on port 3000 "));
