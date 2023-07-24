const jwt = require("jsonwebtoken");
const UserGroupMaster = require("../../models/UserGroupMaster.model");
const UserMaster = require("../../models/UserMaster.model");
const bcrypt = require("bcrypt");
// const httpStatus = require('httpStatus');
const FirmMaster = require("../../api/Firm/FirmMaster.model");
const email = require("../../controllers/email.controller");
const db = require("../../config/database");

exports.getUserGroup = (req, res, next) => {
  UserGroupMaster.find()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log("GetUserGroup", err);
      next(err);
    });
};

exports.createUserGroup = (req, res, next) => {
  const userGroupName = req.body.groupName;
  UserGroupMaster.create({
    UserGroupName: userGroupName,
  })
    .then((result) => {
      res.status(201).send({
        data: result,
        message: "New User Group Created",
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.signupFirm = (req, res, next) => {
  UserGroupMaster.find({ UserGroupName: "Firm_Administrator" })
    .then((resdoc) => {
      bcrypt
        .hash(req.body.password, 12)
        .then((hashedPassword) => {
          return UserMaster.create({
            userLoginId: req.body.userLoginId,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            mobile: req.body.mobile,
            userGroupId: resdoc[0]._id,
          });
        })
        .catch((err) => {
          console.log(err);
          next(err);
        });
    })
    .then((result) => {
      email
        .sendEmail({
          to: req.body.email,
          from: process.env.GMAIL_EMAIL_ID,
          subject: "Account created successfully",
          html: `<div style='box-sizing: border-box'><h4 style='text-align: center;'>Account Created</h4><img src=""  style='justify-content: center;height:50px;width:50px' alt="app icon" /><p>Your account has been created successfully as <b>Firm Administrator</b>.</p><p><b>Username:</b>${req.body.userLoginId}</p></div>`,
        })
        .then((_) => {
          res.status(201).send({
            data: result,
            message:
              "Firm Administrator created successfully.Please create a Firm.",
          });
        })
        .catch((err) => {
          console.log(err);
          res
            .status(200)
            .send({
              data: err,
              message: "User created successfully but unable to send email",
            });
        });
    })
    .catch((err) => {
      next(err);
    });
};

exports.signupUser = (req, res, next) => {
  UserGroupMaster.find({ UserGroupName: req.body.userGroup })
    .then((resdoc) => {
      bcrypt
        .hash(req.body.password, 12)
        .then((hashedPassword) => {
          FirmMaster.find({ FirmEmail: req.body.firmEmail })
            .then((firm) => {
              return UserMaster.create({
                userLoginId: req.body.userLoginId,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hashedPassword,
                mobile: req.body.mobile,
                userGroupId: resdoc[0]._id,
                FirmId: [firm[0]._id],
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
    .then((result) => {
      email
        .sendEmail({
          to: req.body.email,
          from: process.env.GMAIL_EMAIL_ID,
          subject: "Account created successfully",
          html: `<div style='box-sizing: border-box'><h4 style='text-align: center;'>Account Created</h4><img src=""  style='justify-content: center;height:50px;width:50px' alt="app icon" /><p>Your account has been created successfully as <b>Salesman</b> and you are associated to these <p><b>Firm Email: ${req.body.firmEmail}</b></p>.</p><p><b>Username:</b>${req.body.userLoginId}</p></div>`,
        })
        .then((_) => {
          res
            .status(201)
            .send({ data: result, message: "User created successfully" });
        })
        .catch((err) => {
          console.log(err);
          res.status(200).send({
            data: err,
            message: "User created successfully but unable to send email",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.loginUser = (req, res, next) => {
  UserMaster.findOne({ userLoginId: req.body.username })
    .populate("userGroupId", "FirmId")
    .exec()
    .then((user) => {
      if (user) {
        bcrypt
          .compare(req.body.password, user.password)
          .then((doMatch) => {
            if (doMatch) {
              const payload = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              };
              const token = jwt.sign(payload, db.secret, { expiresIn: "1d" });
              const refreshToken = jwt.sign(
                { email: user.email },
                db.secret,
                {}
              );
              if (user.userGroupId.UserGroupName === "Firm_Administrator") {
                const firmNames = [];
                for (let firm of user.FirmId) {
                  firmNames.push(firm.FirmName);
                }
                res.status(200).send({
                  data: {
                    token: token,
                    refreshToken: refreshToken,
                    Firms: firmNames,
                  },
                  message: "User Logged In",
                });
              } else if (
                user.userGroupId.UserGroupName === "Salesman" ||
                user.userGroupId.UserGroupName === "Retailer"
              ) {
                res.status(200).send({
                  data: { token: token, refreshToken: refreshToken },
                  message: "User Logged In",
                });
              } else {
                res.status(200).send({
                  data: { token: token, refreshToken: refreshToken },
                  message: "User Logged In",
                });
              }
            } else {
              res
                .status(401)
                .send({ data: null, message: "Password is Incorrect" });
            }
          })
          .catch((err) => {
            console.log("error logged", err);
            next(err);
          });
      } else {
        res.status(404).send({ data: null, message: "User Not Found" });
      }
    })
    .catch((err) => {
      console.log("error logged", err);
      next(err);
    });
};

exports.forgotPassword = (req, res, next) => {
  UserMaster.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        const token = jwt.sign({ email: req.body.email }, db.secret, {
          expiresIn: 60 * 5,
        });
        const url = `http://localhost:8087/api/getResetPassword/${token}`;
        console.log(token);
        email
          .sendEmail({
            to: req.body.email,
            from: process.env.GMAIL_EMAIL_ID,
            subject: "Verify for resetting password",
            html: `<div style='box-sizing: border-box'><h4 style='text-align: center;'>Verify for Resetting Password</h4><img src=""  style='justify-content: center;height:50px;width:50px' alt="app icon" /><a href=${url}></a></div>`,
          })
          .then((result) => {
            console.log(result);
            res.status(200).send({
              data: result,
              message: "Email send for changing password",
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send({
              data: err,
              message: "Unable to send email for changing password",
            });
          });
      } else {
        res
          .status(404)
          .send({ data: null, message: "No user exist with these email" });
      }
    })
    .catch((err) => {
      console.log("error logged", err);
      next(err);
    });
};

exports.getResetPassword = (req, res, next) => {
  const token = req.params.token;
  jwt.verify(token, db.secret, function (err, decoded) {
    if (err) {
      console.log(err);
      next(err);
    }
    console.log(decoded.email);
    UserMaster.findOne({ email: decoded.email })
      .then((user) => {
        if (user) {
          res.status(200).send({ data: token, message: "User exists" });
        }
        res.status(403).send({ data: null, message: "User does not exist" });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });
};

exports.postResetPassword = (req, res, next) => {
  jwt.verify(req.params.token, db.secret, function (err, decoded) {
    if (err) {
      console.log(err);
      next(err);
    }
    console.log(decoded.email);
    bcrypt
      .hash(req.body.password, 12)
      .then((hashedPassword) => {
        return UserMaster.findOneAndUpdate(
          { email: decoded.email },
          { $set: { password: hashedPassword } }
        );
      })
      .then((_) => {
        res
          .status(200)
          .send({ data: _, message: "User Password updated successfully" });
      })
      .catch((err) => {
        console.log("error logged", err);
        next(err);
      });
  });
};
