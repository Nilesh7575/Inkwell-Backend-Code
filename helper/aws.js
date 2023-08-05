// const AWS = require('aws-sdk');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: 'ap-south-1'
// });
const s3 = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const uploadImageFile = async (file) => {
    const bucketName = 'ask-akshay';

    const uploadParams = {
        ACL: 'public-read',
        Bucket: bucketName,
        Key: "inkewell/" + file.originalname,
        Body: file.buffer,
    };

    try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        if (!data['$metadata']['httpStatusCode'] || data['$metadata']['httpStatusCode'] === 200) {
            const imageUrl = `https://${bucketName}.s3.amazonaws.com/inkewell/${file.originalname}`;
            console.log("Image uploaded successfully:", imageUrl);
            return imageUrl;
        } else {
            throw new Error("Failed to upload image to S3. HTTP status code: " + data['$metadata']['httpStatusCode']);
        }
    } catch (err) {
        throw { error: err };
    }
}
module.exports = { uploadImageFile }
