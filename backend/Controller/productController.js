const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../Models/productModels");
const ApiFeature = require("../utils/apiFeature");
const ErrorHandler = require("../utils/errorHandler");

// create new products -- Admin

exports.createNewProduct = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// get all products

exports.getAllproducts = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

  // console.log(apiFeature)

  const product = await apiFeature.query;

  // console.log(product)

  res.status(201).json({
    success: true,
    product,
    productCount,
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

// create new Review and update reviews
exports.createAndUpdateProductReview = catchAsyncError(
  async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  }
);

// Get all user reviews
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Reviews
exports.deleteReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  let reviews =  product.reviews.filter((rev) => rev._id.toString() !== req.query.id);



  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const ratings = reviews.length===0?avg: avg / reviews.length;
  
  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, ratings, numOfReviews },
    {
      new: true,
      runValidators: true,
      useFindAndModify:false
    }
  );

  res.status(200).json({
    success: true,
    message:"successfully deleted"
  });
});



