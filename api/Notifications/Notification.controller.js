const Notification = require("./Notification.model");
const fcm = require('firebase-admin');
const { admin } = require("googleapis/build/src/apis/admin");


fcm.initializeApp({
    credential: fcm.credential.applicationDefault(),
})
exports.sendSingleDevice = ();