const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../Models/productModels");
const ApiFeature = require("../utils/apiFeature");
const ErrorHandler = require("../utils/errorHandler");

// create new products -- Admin

exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// get all products

exports.getAllproducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5 ;
  const productCount = await Product.countDocuments()
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage)

    // console.log(apiFeature)

  const product = await apiFeature.query;

  // console.log(product)

  res.status(201).json({
    success: true,
    product,
    productCount
  });
});

// get product details

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

// update product By Id -- Admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// delete products -- Admin

exports.deleteProducts = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product not found", 404));

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
