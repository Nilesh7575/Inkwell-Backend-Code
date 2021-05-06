const FirmMaster = require("./FirmMaster.model");
const ProductMaster = require("../Product/ProductMaster.model");
const mongoose = require("mongoose");
const router = require("./Firm.route");
const UserMaster = require("../auth/UserMaster.model");

exports.createFirm = (req, res, next) => {
  if (req.body.productName && req.body.productName.length > 0) {
    FirmMaster.create({
      FirmEmail: req.body.firmEmail,
      FirmName: req.body.firmName,
      type: req.body.type,
      Country: req.body.country,
      State: req.body.State,
      Currency: req.body.currency,
      DBName: req.body.dbName,
      noOfAssociators: req.body.associators,
    })
      .then((firm) => {
        req.body.productName.map((product) => {
          ProductMaster.findOne({ ProductName: product })
            .then((p) => {
              firm.ProductPurchased.push({
                ProductId: p._id,
                availableTill: new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                ),
              });
            })
            .catch((err) => {
              console.log(err);
              next(err);
            });
        });
        return firm.save();
      })
      .then((firm) => {
        res
          .status(201)
          .send({ data: firm, message: "Firm created successfully" });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    FirmMaster.create({
      FirmEmail: req.body.firmEmail,
      FirmName: req.body.firmName,
      type: req.body.type,
      Country: req.body.country,
      State: req.body.State,
      Currency: req.body.currency,
      DBName: req.body.dbName,
      noOfAssociators: req.body.associators,
    })
      .then((firm) => {
        res.status(201).send({
          data: firm,
          message:
            "Firm created successfully, But you haven't purchased nay product.",
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
};

exports.getAllFirms = (req, res, next) => {
  FirmMaster.find()
    .then((firms) => {
      const retFirms = [];
      firms.map((firm) => {
        firm.ProductPurchased.map((pp) => {
          ProductMaster.findOne({ _id: pp.ProductId })
            .then((product) => {
              delete pp[ProductId];
              pp[ProductName] = product.ProductName;
            })
            .catch((err) => {
              console.log(err);
              next(err);
            });
        });
        retFirms.push(firm);
      });
      res.status(200).send({
        data: retFirms,
        message: "Fetched all firm details successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getFirmDetails = (req, res, next) => {
  FirmMaster.findById(mongoose.Types.ObjectId(req.params.firmId))
    .then((firm) => {
      firm.ProductPurchased.map((pp) => {
        ProductMaster.findOne({ _id: pp.ProductId })
          .then((product) => {
            delete pp[ProductId];
            pp[ProductName] = product.ProductName;
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      });
      res
        .status(200)
        .send({ data: firm, message: "Firm Details fetched successfully" });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.updateFirmDetails = (req, res, next) => {
  FirmMaster.findById(mongoose.Types.ObjectId(req.params.firmId))
    .then((firm) => {
      firm.FirmEmail = req.body.firmEmail;
      firm.FirmName = req.body.firmName;
      firm.type = req.body.type;
      firm.Country = req.body.country;
      firm.State = req.body.State;
      firm.Currency = req.body.currency;
      firm.DBName = req.body.dbName;
      firm.noOfAssociators = req.body.associators;
      return firm.save();
    })
    .then((firm) => {
      res
        .status(200)
        .send({ data: firm, message: "Firm Details updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.deleteFirm = (req, res, next) => {
  const getId = mongoose.Types.ObjectId(req.params.firmId);
  UserMaster.updateMany(
    { FirmID: { $in: [getId] } },
    { $pull: { FirmID: getId } }
  )
    .then(() => {
      FirmMaster.findByIdAndDelete(getId)
        .then(() => {
          res
            .status(200)
            .send({ data: null, message: "Firm Deleted successfully" });
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