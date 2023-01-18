const express = require("express");
const {
  getAllproducts,
  createNewProduct,
  updateProduct,
  deleteProducts,
  getProductDetails,
} = require("../Controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(isAuthenticatedUser, getAllproducts);

router.route("/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createNewProduct);
router
  .route("/products/:id")
  .put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProducts)
  .get(getProductDetails);

module.exports = router;
