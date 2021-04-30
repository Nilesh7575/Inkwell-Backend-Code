const express = require("express");
const controller = require("./Subscription.controller");

const router = express.Router();

router.post("/subscription/:firmId?product=", controller.extendSubscription);

router.post("/subscribe/:firmId?product=", controller.subscribeProduct);

module.exports = router;
