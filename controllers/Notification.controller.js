const Notification = require("../api/Notifications/Notification.model");
const admin = require("firebase-admin");
const DeviceMaster = require("../api/DeviceMaster.model");
const Promise = require("bluebird");

fcm.initializeApp({
  credential: admin.credential.applicationDefault(),
});

// exports.sendNotificaton = (message) => {
//   admin
//     .messaging()
//     .sendMulticast(message)
//     .then((res) => {
//       console.log(response);
//       DeviceMaster.find({ fcm_token: {$in: message.tokens} })
//         .then((devices) => {
//           return Notification.create({
//             userId: ,
//             deviceId: device._id,
//             message: message,
//           });
//         })
//         .then((notification) => {
//           return Promise.resolve(notification);
//         })
//         .catch((err) => {
//           console.log(err);
//           return Promise.reject(
//             new Error(`${err}:Error while saving notification data in db`)
//           );
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       return Promise.reject(`${err}:Sending notification failed`);
//     });
// };

// exports.sendMultipleDevices
