const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });
  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        console.log("Failed to create access token", err);
        reject(err);
      }
      resolve(token);
    });
  });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_EMAIL_ID,
      accessToken,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      tls: {
        rejectUnauthorized: false,
      },
    },
  });
  return transporter;
};

exports.sendEmail = async (emailOptions) => {
  const emailTransporter = await createTransporter();
  await emailTransporter.sendMail(emailOptions);
};
