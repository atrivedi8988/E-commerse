const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../Models/userModel");
const sendToken = require("../utils/jwtToken");

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
