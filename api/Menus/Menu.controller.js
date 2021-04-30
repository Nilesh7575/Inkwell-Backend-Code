const MenuMaster = require("./MenuMaster.model");
const ProductMaster = require("../Product/ProductMaster.model");
const jwt = require("jsonwebtoken");
const db = require("../../config/database");
const UserGroupRoles = require("../auth/UserGroupRoles.model");
const {
  uploadSingle,
  uploadArray,
} = require("../../fileUpload/fileUpload.controller");
const UserGroupMaster = require("../auth/UserGroupMaster.model");
const FirmMaster = require("../Firm/FirmMaster.model");
const mongoose = require("mongoose");

exports.createNewMenu = (req, res, next) => {
  let productId;
  if (req.body.productName) {
    ProductMaster.findOne({ ProductName: req.body.productName })
      .then((product) => {
        if (product) {
          productId = product._id;
          if (req.body.relatedTo) {
            MenuMaster.findOne({ MenuName: req.body.realtedTo }).then(
              (menu) => {
                const extArray = req.file.originalname.split(".");
                const ext = extArray[extArray.length - 1];
                if (menu) {
                  uploadSingle(req, res, (err) => {
                    if (err) {
                      res.status(500).send({
                        data: err,
                        message: "Error While Uploading file",
                      });
                    }
                    return MenuMaster.create({
                      ProductId: product._id,
                      MenuName: req.body.menuName,
                      WidgetName: req.body.widgetName,
                      WidgetInputs: req.body.widgetInputs,
                      MenuDescription: req.body.menuDescription,
                      SysDefault: False,
                      MenuIcon: `${req.headers.host}/files/application/${req.body.menuName}.${ext}`,
                      MenuRelated: menu._id,
                    });
                  });
                } else {
                  res.status(404).send({
                    data: null,
                    message: "Menu to which you want to relate doesn't exist",
                  });
                }
              }
            );
          } else {
            return MenuMaster.create({
              ProductId: product._id,
              MenuName: req.body.menuName,
              WidgetName: req.body.widgetName,
              WidgetInputs: req.body.widgetInputs,
              MenuDescription: req.body.menuDescription,
              SysDefault: False,
              MenuIcon: `${req.headers.host}/files/application/${req.body.menuName}.${ext}`,
            }).catch((err) => {
              console.log(err);
              next(err);
            });
          }
        } else {
          res
            .status(404)
            .send({ data: null, message: "Product doesn't exist" });
        }
      })
      .then((menu) => {
        req.body.availableTo.map((group) => {
          UserGroupMaster.findOne({ UserGroupName: group })
            .then((grp) => {
              return UserGroupRoles.create({
                UserGroupID: grp._id,
                ProductID: productId,
                MenuID: menu._id,
                CanView: True,
              });
            })
            .then((result) => {
              console.log(result);
              res
                .status(201)
                .send({ data: menu, message: "Menu Created successfully" });
            })
            .catch((err) => {
              console.log(err);
              next(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } else {
    upload(req, res, (err) => {
      if (err) {
        res
          .status(500)
          .send({ data: null, message: "Error While Uploading file" });
      }
      const extArray = req.file.originalname.split(".");
      const ext = extArray[extArray.length - 1];
      return MenuMaster.create({
        MenuName: req.body.menuName,
        WidgetName: req.body.widgetName,
        WidgetInputs: req.body.widgetInputs,
        MenuDescription: req.body.menuDescription,
        SysDefault: True,
        MenuIcon: `${req.headers.host}/files/application/${req.body.menuName}.${ext}`,
        MenuRelated: menu._id,
      });
    })
      .then((result) => {
        console.log(result);
        res
          .status(201)
          .send({ data: result, message: "Menu Created successfully" });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  }
};

const subMenu = (grpId, prodId, View, id) => {
  let menu = [];
  UserGroupRoles.find({ UserGroupID: grpId, ProductID: prodId, CanView: View })
    .populate("MenuID")
    .exec()
    .then((menugrp) => {
      const retMenu = menugrp.filter((m) => m.MenuId.MenuRelated == id);
      retMenu.map((m) => {
        if (m.MenuID.MenuType === "SubMenu") {
          const retMenuAg = subMenu(grpId, prodId, View, m.MenuID._id);
          const menuName = m.MenuID.MenuName;
          menu.push({ menuName: retMenuAg });
        } else {
          menu.push(m);
        }
      });
      return menu;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

exports.getMenu = async (req, res, next) => {
  const token = await req.headers["Authorization"].split(" ")[1];
  const decoded = await jwt.verify(token, db.secret);
  const firmId = await req.query.firmId;
  UserMaster.findOne({ email: decoded.email })
    .then((user) => {
      if (user) {
        FirmMaster.findOne({ _id: mongoose.Types.ObjectId(firmId) })
          .populate("ProductPurchased.ProductId")
          .exec()
          .then((firm) => {
            firm.ProductPurchased.map((pp) => {
              if (pp.availableTill > Date.now()) {
                UserGroupRoles.find({
                  UserGroupID: user.userGroupId,
                  ProductID: pp.ProductId,
                  CanView: True,
                })
                  .populate("MenuID")
                  .exec()
                  .then((menugrp) => {
                    if (menugrp.length > 0) {
                      let curMenu = [];
                      menugrp.map((m) => {
                        if (m.MenuID.MenuType === "MainMenu") {
                          let recMenus = subMenu(
                            user.userGroupId,
                            product._id,
                            True,
                            m.MenuID._id
                          );
                          const menuName = m.MenuID.MenuName;
                          curMenu.push({ menuName: recMenus });
                        }
                      });
                      if (curMenu.length > 0) {
                        res
                          .status(200)
                          .send({
                            data: curMenu,
                            message: "Menu Fetched successfully",
                          });
                      } else {
                        res
                          .status(404)
                          .send({
                            data: null,
                            message:
                              "No Products subscribed.So, no menus to show",
                          });
                      }
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    next(err);
                  });
              }
            });
          })
          .catch((err) => {
            console.log(err);
            next(err);
          });
      } else {
        throw new Error("User is unauthorized");
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
