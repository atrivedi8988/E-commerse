const express = require("express");
const { getAllproducts, createNewProduct, updateProduct, deleteProducts, getProductDetails } = require("../Controller/productController");


const router = express.Router();

router.route("/products").get(getAllproducts)

router.route("/products/new").post(createNewProduct)
router.route("/products/:id").put(updateProduct).delete(deleteProducts).get(getProductDetails)

module.exports = router