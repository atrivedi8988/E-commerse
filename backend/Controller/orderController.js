const Order = require("../Models/orderModel");
const Product = require("../Models/productModels");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");

// create new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// Get logged in user single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if(!order){
    return next(new ErrorHandler("order not found with this id",404))
  }

  res.status(200).json({
    success:true,
    order
  })
});

// Get logged in user my order

exports.myOrder = catchAsyncError(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id});



    res.status(200).json({
        success:true,
        orders
    })
})
