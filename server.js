const express = require("express");

const app = express();

app.use(express.json());
app.get("/", (req, res) =>
{
    res.send("Hello, World!");
});

app.use((req,res) =>
{
    res.status(404).send("Not Found");
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});