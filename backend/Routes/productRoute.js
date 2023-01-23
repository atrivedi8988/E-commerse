const express = require("express");
const {
  getAllproducts,
  createNewProduct,
  updateProduct,
  deleteProducts,
  getProductDetails,
  createAndUpdateProductReview,
} = require("../Controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/products").get(getAllproducts);

router.route("/admin/products/new").post(isAuthenticatedUser, authorizeRoles("admin"), createNewProduct);

router
  .route("/admin/products/:id")
  .put(isAuthenticatedUser,authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProducts)
  
router.route("/products/:id").get(getProductDetails);

router.route("/review").put(isAuthenticatedUser,createAndUpdateProductReview)

module.exports = router;
