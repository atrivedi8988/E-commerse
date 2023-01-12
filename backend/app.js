const express = require("express");
const errorMiddleware = require("./middleware/error");
const app = express();

app.use(express.json());


// import routes
const product = require("./Routes/productRoute")
const user = require("./Routes/userRoutes")

app.use("/api/v1",product)
app.use("/api/v1",user)


// middleware for errors

app.use(errorMiddleware)


module.exports = app