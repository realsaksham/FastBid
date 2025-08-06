
// controllers/otpController.js
const otpGenerator = require('otp-generator');
const OTP = require('../Models/otpModel');
const User = require('../Models/userModel');
const validator = require('validator')

exports.sendOTP = async (req, res) => {
  let success;
  try {

    const { username, email, pwd } = req.body;

    // Check if all details are provided
    if (!username || !email || !pwd ) {
        success = false
        return res.status(403).json({success , error: "All fields are required"})
    }

    if(username.length < 4){
        success = false
        return res.status(403).json({success , error: "Name should be of atleast 4 characters"})
    }
    const startsWithAlphabetRegex = /^[a-zA-Z]/;
        if (!startsWithAlphabetRegex.test(username)) {
          return res.status(400).json({ success, error: "Name must start with an alphabet character" });
    }
      
      
    if(!validator.isEmail(email)){
      success = false
      return res.status(403).json({success , error: "Invalid Email"})
    }
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    
    // If user found with provided email
    if (checkUserPresent) {
      success = false
      return res.status(401).json({success , error: 'User is already registered',});
    }
    //const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    // const strongPasswordRegex=true;
    // if(!strongPasswordRegex.test(pwd)){
    //     success = false
    //     return res.status(403).json({success , error: "Password is too weak"})
    // }
    
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    
    
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    
    
    const otpPayload = { email, otp };
    await OTP.create(otpPayload);
    success = true
    res.status(200).json({success , message: "OTP sent successfully"})

  } catch (error) {
    success = false
    console.log(error.message);
    return res.status(500).json({success , error: error.message });
  }
};



