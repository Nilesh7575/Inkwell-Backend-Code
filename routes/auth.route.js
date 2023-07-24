const express = require('express');
const controller = require('../middleware/auth/auth.controller');

const router = express.Router();

router.get('/usergrpmaster',controller.getUserGroup);

router.post('/usergrpmaster',controller.createUserGroup);

router.post('/signupFirmAdmin',controller.signupFirm);

router.post('/signupUser',controller.signupUser);

router.post('/loginUser',controller.loginUser);

router.post('/forgotPassword',controller.forgotPassword);

router.get('/getResetPassword/:token',controller.getResetPassword);

router.post('/postResetPassword/:token',controller.postResetPassword);

module.exports = router;