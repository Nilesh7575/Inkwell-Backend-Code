const express = require("express");
const controller = require("./Firm.controller");

const router = express.Router();

router.post("/createFirm", controller.createFirm);

router.get("/getFirms", controller.getAllFirms);

router.get("/getFirmDetails/:firmId", controller.getFirmDetails);

router.put("/updateFirm/:firmId", controller.updateFirmDetails);

router.delete("/deleteFirm/:firmId", controller.deleteFirm);

module.exports = router;
