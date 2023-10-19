const documentModel = require("../models/documentsModel");
const { uploadImageFile } = require("../../helper/aws");


const uploadKYCDocuments = async (req, res, next) => {
  try {
    const files = req.files
    const { belongs_to, documentType } = req.body
    
    if (req.fileValidationError) {
      return res.status(400).json({ error: req.fileValidationError });
    }
    if (!req.files.length) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    for(let i=0; i < req.files.length; i++){
      let logoUrl = await uploadImageFile(files[i]);
      console.log(logoUrl);
      
      await documentModel.create({
        belongs_to: belongs_to,
        documentType: documentType,
        documentURL: logoUrl
      })
    }
    // if (req.files.some(file => !file.location)) {
    //   return res.status(500).json({ error: 'Failed to upload some files.' });
    // }

    res.status(200).json({ message: 'KYC documents uploaded successfully' });
  } catch (error) {
    console.error('Error uploading KYC documents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  uploadKYCDocuments
};

