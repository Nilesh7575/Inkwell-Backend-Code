const FirmMaster = require("../Firm/FirmMaster.model");
const ProductMaster = require("../Product/ProductMaster.model");
const mongoose = require("mongoose");

exports.extendSubscription = (req, res, next) => {
  FirmMaster.findOne({ _id: mongoose.Types.ObjectId(req.params.firmId) })
    .populate("ProductPurchased.ProductId")
    .exec()
    .then((firm) => {
      firm.ProductPurchased.map((p) => {
        if (p.ProductId.ProductName === req.query.product) {
          p.availableTill = req.body.date;
        }
      });
      return firm.save();
    })
    .then((firm) => {
      res.status(200).send({
        data: firm,
        message: "Subscription date extended successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.subscribeProduct = (req, res, next) => {
  FirmMaster.findOne({ _id: mongoose.Types.ObjectId(req.params.firmId) })
    .then((firm) => {
      ProductMaster.findOne({ ProductName: req.query.product })
        .then((product) => {
          firm.ProductPurchased.push({
            ProductId: product._id,
            availableTill: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            ),
          });
          return firm.save();
        })
        .then((firm) => {
          res
            .status(200)
            .send({ data: firm, message: "Product subscribed successfully" });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
