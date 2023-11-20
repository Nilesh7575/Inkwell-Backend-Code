// const twilio = require('twilio');
const axios = require('axios')


const accountSid = 'ACd7bff6f4a1c84e9fe373f34156487e26';
const authToken = '25f27bd561837ee4e694bca440d2d80c';

// const client = new twilio(accountSid, authToken);

// const sendMsg = async (mobileNumber, otp) => {
//     try {
//         const response = await client.messages
//             .create({
//                 body: `Here is your 'Track Karo' App OTP. Please do not share it with anyone. One-time OTP: ${otp}.`,
//                 from: '+17799993692', // Use a Twilio phone number you've purchased or verified
//                 to: `+91${mobileNumber}` // The recipient's phone number (including country code)
//             })

//         console.log(`Message sent with SID: ${response.sid}`)
//         return responsex

//     } catch (error) {
//         console.error(`Error sending message: ${error.message}`)
//         return error.message
//     }
// }

const sendSMS = async (mobileNumber, otp) => {
    const url = 'http://login.easywaysms.com/app/smsapi/index.php';
    const params = {
        key: '36507DB5558D0F',
        campaign: '0',
        routeid: '7',
        type: 'text',
        contacts: mobileNumber,
        senderid: 'TOMKUM',
        msg: `Dear User,\n\nYour OTP is ${otp} for registration - ${mobileNumber}. Valid for 30 minutes. Please do not share this OTP. \n\nRegards \nTOMKUM`,
        template_id: '1207169037651138885',
    };

    try {
        const response = await axios.get(url, {
            params,
            headers: {
                'User-Agent': 'Axios',
            },
        });

        console.log('SMS Response:', response.data);
        return response
    } catch (error) {
        console.error('Error:', error);
    }
};
module.exports = { sendSMS }