const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send(`<h1>Hello Backend is working</h1>`);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server is running at port ${PORT}`);
});
