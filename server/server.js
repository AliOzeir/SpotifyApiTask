require("dotenv").config();
const express = require("express");
const cors = require("cors");
const loginController = require("./controller")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.post('/login',loginController.loginPost)
app.post("/refresh", loginController.refreshPost);

const PORT = 7000

app.listen(PORT, () => {
  console.log("Server Running at Port = 7000");
});
