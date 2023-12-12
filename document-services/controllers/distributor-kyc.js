const documentModel = require("../models/documentsModel");
const { uploadImageFile } = require("../../helper/aws")
const sharp = require('sharp');


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

    const uploadPromises = req.files.map(async (file) => {
      let logoUrl;

      // Check if the file size is greater than 500kb
      if (file.size > 500 * 1024) {
        // Compress the image using sharp
        const compressedImageBuffer = await sharp(file.buffer)
          .resize({ width: 500, height: 500, fit: 'inside' })
          .jpeg({ quality: 80 })
          .toBuffer();

        // Upload the compressed image
        logoUrl = await uploadImageFile({
          buffer: compressedImageBuffer,
          originalname: file.originalname,
        });
      } else {
        // Upload the original image
        logoUrl = await uploadImageFile(file);
      }

      console.log(logoUrl);

      // Create document record in the database
      await documentModel.create({
        belongs_to: belongs_to,
        documentType: documentType,
        documentURL: logoUrl,
      });
    });

    // Wait for all uploads to complete before responding
    await Promise.all(uploadPromises);

    res.status(200).json({ message: 'KYC documents uploaded successfully' });
  } catch (error) {
    next(error)
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  uploadKYCDocuments
};

