const Locksmith = require('../models/Locksmith');
const { uploadToS3 } = require('../utils/fileUpload'); // You'll need to implement this

exports.completeProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      businessName,
      serviceArea,
      licenseNumber,
      insuranceInfo,
      phone
    } = req.body;

    // Handle file uploads
    const idProofUrl = req.files?.idProof ? await uploadToS3(req.files.idProof) : null;
    const licenseProofUrl = req.files?.licenseProof ? await uploadToS3(req.files.licenseProof) : null;

    const locksmith = new Locksmith({
      name,
      email,
      phone,
      businessName,
      location: {
        city: serviceArea, // This is simplified, you might want to parse this better
        state: '', // Add these fields to your form if needed
        zip: ''  // Add these fields to your form if needed
      },
      documents: [
        {
          type: 'license',
          number: licenseNumber,
          url: licenseProofUrl
        },
        {
          type: 'other',
          number: 'ID',
          url: idProofUrl
        }
      ],
      verificationStatus: 'pending'
    });

    await locksmith.save();
    
    res.status(201).json({
      message: 'Profile submitted for verification',
      locksmithId: locksmith._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const locksmith = await Locksmith.findById(req.locksmith.id).select('-password');
    if (!locksmith) {
      return res.status(404).json({ message: 'Locksmith not found' });
    }
    res.status(200).json(locksmith);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 