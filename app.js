const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.post("/query", async (req, res) => {
  console.log(req.body.url);
  const response = await axios.get(req.body.url);
  const objResponse = response.data;
  let result = {};

  getObjectsAndCount({ d: objResponse }, result);

  res.json({ raw: objResponse, processed: result.d });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

function getObjectsAndCount(object, result) {
  keys = Object.keys(object);
  result.objectCount = keys.length;
  keys.forEach((key) => {
    const value = object[key];
    const sortedKey = sortDescending(key);
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      result[sortedKey] = {};
      getObjectsAndCount(value, result[sortedKey]);
    } else if (Array.isArray(value)) {
      result[sortedKey] = [];
      value.forEach((val) => {
        const newObj = {};
        getObjectsAndCount(val, newObj);
        result[sortedKey].push(newObj);
      });
    } else {
      if (typeof value === "string") result[sortedKey] = sortDescending(value);
      else result[sortedKey] = object[key];
    }
  });
}

function sortDescending(key) {
  return key.split("").sort().reverse().join("");
}
