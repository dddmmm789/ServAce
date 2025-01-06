const OTP = require('../models/OTP');
const Locksmith = require('../models/Locksmith');
const jwt = require('jsonwebtoken');

exports.requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    
    // In development, always use 123456 as OTP
    const otp = process.env.NODE_ENV === 'development' ? '123456' : Math.floor(100000 + Math.random() * 900000).toString();
    
    await OTP.create({ phone, otp });
    
    // In production, send OTP via SMS
    if (process.env.NODE_ENV === 'production') {
      // Add SMS sending logic here
    }
    
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    // In development, accept 123456 as valid OTP
    if (process.env.NODE_ENV === 'development' && otp === '123456') {
      return res.status(200).json({ message: 'OTP verified successfully' });
    }
    
    const otpRecord = await OTP.findOne({ phone, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    await OTP.deleteOne({ _id: otpRecord._id });
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Debug log
    console.log('Login attempt:', { phone });
    
    const locksmith = await Locksmith.findOne({ phone });
    // Debug log
    console.log('Locksmith found:', locksmith ? 'yes' : 'no');
    
    if (!locksmith) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await locksmith.comparePassword(password);
    // Debug log
    console.log('Password match:', isMatch ? 'yes' : 'no');
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (locksmith.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'Account pending verification' });
    }
    
    const token = jwt.sign(
      { id: locksmith._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      locksmith: {
        id: locksmith._id,
        name: locksmith.name,
        businessName: locksmith.businessName,
        status: locksmith.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 