const axios = require('axios')


const sendMessageOtp = async (mobileNumber, otp) => {

    try {

        const response = await axios.post(
            `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONEID}/messages`,

            {
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": `+91${mobileNumber}`,
                "type": "text",
                "text": {
                    "preview_url": false,
                    "body": `Here is your OTP Don't share it to anyone,One time OTP-${otp}`
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                },
            }
        )
        return response;
    } catch (err) {
        console.log(err.message)
        return (err.message)
    }
}
module.exports = { sendMessageOtp }