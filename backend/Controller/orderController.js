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

// Get All orders -- Admin

exports.getAllOrders = catchAsyncError(async(req,res,next)=>{
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((el)=>{
    totalAmount+=el.totalPrice
  })

  res.status(200).json({
    success:true,
    totalAmount,
    orders,
  })
})

// Update order status -- Admin

exports.updateOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(order.orderStatus==="Delivered"){
    return next(new ErrorHandler("You have already delivered this item",400))
  }

  order.orderItems.forEach(async(el)=>{
    await updateStock(el.product,el.quantity)
  })

  order.orderStatus = req.body.status;

  if(req.body.status==="Delivered"){
    order.deliveredAt = Date.now()
  }

  await order.save({validateBeforeSave:false})

  res.status(200).json({
    success:true
  })
})

async function updateStock(id,quantity){
  const product = await Product.findById(id)

  product.stock -= quantity

  await product.save({validateBeforeSave:false})
}


// Delete order -- Admin

exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
  const order = await Order.findById(req.params.id);

  if(!order){
    return next(new ErrorHandler("Order not found with this is",404))
  }

  await order.remove()

  res.status(200).json({
    success:true,
    message:"Deleted Successfully"
  })
})
