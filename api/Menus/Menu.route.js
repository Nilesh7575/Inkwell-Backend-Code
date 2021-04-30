const express = require("express");
const controller = require("./Menu.controller");

const router = express.Router();

router.post("/createMenu", controller.createNewMenu);

router.get("/getMenu?firmId=", controller.getMenu);

module.exports = router;
