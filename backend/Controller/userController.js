const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js")

// Register new User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "this is a sample id",
      url: "profileurl",
    },
  });

  sendToken(user,201,res)
});


// Login user

exports.loginUser = catchAsyncError(async(req,res,next)=>{
  const {email,password} = req.body;

  // checking if user has given password and email both
  if(!email || !password){
    return next(new ErrorHandler("please Enter Eamil & Password",400))
  }

    const user  = await User.findOne({email}).select("+password");


    if(!user){
      return next(new ErrorHandler("Invalid email & password"),401)
    }

    const isPasswordMatched = await user.comparePassword(password)

    
    if(!isPasswordMatched){
      return next(new ErrorHandler("Invalid email & password"),401)
    }

 sendToken(user,200,res)

})

// logout user

exports.logoutUser = catchAsyncError((req,res,next)=>{
  res.cookie("token",null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })

  res.status(200).json({
    success:true,
    message:"Logged Out"
  })
})


// forgot Password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
  const user = await User.findOne({email:req.body.email});

  if(!user){
    return next(new ErrorHandler("User not found",404))
  }

  // Get ResetPassword Token 
  const resetToken =  user.getResetPasswordToken();

  await user.save({validateBeforeSave:false})

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl}\n\n If you have not requested this email then, please ignore it.`

 try {
  await sendEmail({
    email:user.email,
    subject:"Ecommerse password reset",
    message
  })

  res.status(200).json({
    success:true,
    message:`Email sent to ${user.email} successfully`
  })
 } catch (error) {
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save({validateBeforeSave:false})

  return next(new ErrorHandler(error.message,500))
 }

})