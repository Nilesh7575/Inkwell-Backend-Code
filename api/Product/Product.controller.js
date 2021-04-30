const ProductMaster = require("./ProductMaster.model");
const {
  uploadSingle,
  uploadArray,
} = require("../../fileUpload/fileUpload.controller");
const mongoose = require("mongoose");
const MenuMaster = require("../Menus/MenuMaster.model");
const FirmMaster = require("../Firm/FirmMaster.model");
const UserGroupRoles = require("../auth/UserGroupRoles.model");
const fs = require("fs");
const Promise = require("bluebird");

exports.createProduct = (req, res, next) => {
  uploadArray(req, res, (err) => {
    if (err) {
      res
        .status(500)
        .send({ data: err, message: "Error while uploading product image" });
    }
    ProductMaster.create({
      ProductName: req.body.productName,
      Description: req.body.description,
      Url: req.body.url,
      Price: req.body.price,
    })
      .then((product) => {
        req.files.map((file) => {
          const extArray = file.originalname.split(".");
          const ext = extArray[extArray.length - 1];
          product.Image.push(
            `${req.headers.host}/files/application/${product.ProductName}-${file.originaName}.${ext}`
          );
        });
        return product.save();
      })
      .then((product) => {
        res
          .status(201)
          .send({ data: product, message: "Product successfully created" });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });
};

exports.getAllProducts = (req, res, next) => {
  ProductMaster.find()
    .then((products) => {
      if (products.length > 0) {
        res
          .status(200)
          .send({ data: products, message: "Products fetched successfully" });
      } else {
        res.status(404).send({ data: null, message: "Products not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getOneProduct = (req, res, next) => {
  ProductMaster.findOne({ _id: mongoose.Types.ObjectId(req.params.productId) })
    .then((product) => {
      if (product) {
        res
          .status(200)
          .send({ data: product, message: "Product fetched successfully" });
      } else {
        res.status(404).send({
          data: null,
          message: "Product with the given id doesn't exist",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.updateProduct = (req, res, next) => {
  const getId = mongoose.Types.ObjectId(req.params.productId);
  if (
    (req.body.length > 0 && req.body.name) ||
    req.body.description ||
    req.body.url ||
    req.body.price
  ) {
    if (req.files && req.files.length > 0) {
      ProductMaster.findOne({ _id: getId })
        .then((product) => {
          if (req.files.length <= 5 - product.Image.length) {
            uploadArray(req, res, (err) => {
              if (err) {
                res.status(500).send({
                  data: err,
                  message: "Error while uploading product image",
                });
              }
              req.files.map((file) => {
                const extArray = file.originalname.split(".");
                const ext = extArray[extArray.length - 1];
                product.Image.push(
                  `${req.headers.host}/files/application/${product.ProductName}-${file.originaName}.${ext}`
                );
              });
              product.ProductName = req.body.name;
              product.Description = req.body.description;
              product.Url = req.body.url;
              product.price = req.body.price;
              return product.save();
            });
          } else {
            deleteFiles({ _id: getId }, ProductMaster, ProductName)
              .then((response) => {
                uploadArray(req, res, (err) => {
                  if (err) {
                    res.status(500).send({
                      data: err,
                      message: "Error while uploading product image",
                    });
                  }
                  req.files.map((file) => {
                    const extArray = file.originalname.split(".");
                    const ext = extArray[extArray.length - 1];
                    product.Image.push(
                      `${req.headers.host}/files/application/${product.ProductName}-${file.originaName}.${ext}`
                    );
                  });
                  product.ProductName = req.body.name;
                  product.Description = req.body.description;
                  product.Url = req.body.url;
                  product.price = req.body.price;
                  return product.save();
                });
              })
              .catch((err) => {
                console.log(err);
                next(err);
              });
          }
        })
        .then((product) => {
          res.status(200).send({
            data: product,
            message: "Product details updated successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    }
  }
};

const deleteFiles = (condition, collection, fieldName) => {
  collection
    .find(condition)
    .then((result) => {
      if (result.length > 0) {
        const directory = `${req.headers.host}/files/application/`;
        result.map((m) => {
          fs.readdir(directory, (err, data) => {
            if (err) {
              return Promise.reject(
                new Error(
                  `${err}:Error while deleting related files can\'t complete the deleting process`
                )
              );
            }
            data.forEach((file) => {
              if (fieldName == ProductName) {
                if (file.split(".")[0].split("-")[0] == m.fieldName) {
                  return Promise.resolve(fs.unlink(directory + file));
                } else {
                  return Promise.reject(
                    new Error("No files of these desired name")
                  );
                }
              }
              if (file.split(".")[0] == m.fieldName) {
                return Promise.resolve(fs.unlink(directory + file));
              } else {
                return Promise.reject(
                  new Error("No files of these desired name")
                );
              }
            });
          });
        });
      } else {
        return Promise.reject(
          new Error(
            `No document exists in ${collection} with that specified condition`
          )
        );
      }
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(`${err}: Error while fetching documents`);
    });
};

exports.deleteProduct = (req, res, next) => {
  const getId = mongoose.Types.ObjectId(req.params.productId);
  deleteFiles({ _id: getId }, ProductMaster, ProductName)
    .then((success) => {
      ProductMaster.findOneAndDelete({ _id: getId })
        .then((result) => {
          deleteFiles({ ProductID: getId }, MenuMaster, MenuName)
            .then((s) => {
              MenuMaster.deleteMany({ ProductID: getId })
                .then((output) => {
                  UserGroupRoles.deleteMany({ ProductID: getId })
                    .then((outcome) => {
                      FirmMaster.updateMany(
                        { ProductId: { $in: [getId] } },
                        { $pull: { ProductId: getId } }
                      )
                        .then((result2) => {
                          res.status(200).send({
                            data: result2,
                            message:
                              "Product deleted successfully, Related Menus cleared,Group Roles cleared, Firms having same service appended",
                          });
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
