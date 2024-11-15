import express from "express";
const cors = require("cors");
const app = express();
const port = 10000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
