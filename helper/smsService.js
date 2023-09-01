const twilio = require('twilio');


const accountSid = 'ACd7bff6f4a1c84e9fe373f34156487e26';
const authToken = '25f27bd561837ee4e694bca440d2d80c';

const client = new twilio(accountSid, authToken);

const sendMsg = async (mobileNumber, otp) => {
    try {
        const response = await client.messages
            .create({
                body: `Here is your 'Track Karo' App OTP. Please do not share it with anyone. One-time OTP: ${otp}.`,
                from: '+17799993692', // Use a Twilio phone number you've purchased or verified
                to: `+91${mobileNumber}` // The recipient's phone number (including country code)
            })

        console.log(`Message sent with SID: ${response.sid}`)
        return response

    } catch (error) {
        console.error(`Error sending message: ${error.message}`)
        return error.message
    }
}

module.exports = { sendMsg }