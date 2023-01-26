const express = require("express");
const { newOrder, getSingleOrder, myOrder } = require("../Controller/orderController")
const router = express.Router()

const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")

router.route("/order/new").post(isAuthenticatedUser, newOrder)

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder)

router.route("/orders/me").get(isAuthenticatedUser,myOrder)

module.exports = router