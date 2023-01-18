const express = require("express");
const errorMiddleware = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser")

app.use(express.json());
app.use(cookieParser())


// import routes
const product = require("./Routes/productRoute")
const user = require("./Routes/userRoutes")

app.use("/api/v1",product)
app.use("/api/v1",user)


// middleware for errors

app.use(errorMiddleware)


module.exports = app