const { ApiError } = require("../utils/ApiError.js");
const User= require("../model/user.model.js");
const asyncHandler = require("../utils/AsyncHandler.js");
const { ApiResponse } = require("../utils/ApiResponse.js");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Helper: Generate access & refresh tokens
const generateAccesTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    console.log(accessToken);
    

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  console.log("in register");
  
  const {fullName,username,email, password}=req.body;

  
  
 const existedUser = await User.findOne({
  $or: [{username }, { email }],
});

if (existedUser) {
  throw new ApiError(409, "User already exists");
}


  const user = await User.create({
    fullName,
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong during registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
 
  

  if (!(username)) {
    throw new ApiError(400, "Username is required");
  }

  const user = await User.findOne({ $or: [{ username }] });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccesTokenAndRefreshToken(
    user._id
  );

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggedinUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// Logout User
const logedOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

module.exports = { registerUser, loginUser, logedOutUser };
