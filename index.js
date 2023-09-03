const mongoose = require("mongoose");
const mongodb = require("mongodb");
const express = require("express");
const logger = require("morgan");
const passport = require("passport");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const compress = require("compression");
const cors = require("cors");
const httpStatus = require("http-status");
const winston = require("winston");
const expressWinston = require("express-winston");
const expressValidation = require("express-validation");
const helmet = require("helmet");
const boom = require("boom");
require("dotenv").config();
const userRoutes = require('./routes/userRoute')
const productRoutes = require('./routes/productRoute')
const productTypeRoutes = require('./routes/productTypeRoute')
const brandRoutes = require('./routes/brandRoute')
const categoryRoutes = require('./routes/categoryRoute')
const app = express();
const Port = process.env.PORT || 8087;
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
mongoose.set("useCreateIndex", true);
app.use(methodOverride());
app.use(cors());
app.use(helmet());
Promise = require("bluebird");
const multer = require("multer");
mongoose.Promise = Promise;
app.use(multer().any());

// if (process.env.NODE_ENV === "development") {
//   app.use(logger("dev"));
//   expressWinston.requestWhitelist.push("body");
//   expressWinston.responseWhitelist.push("body");
//   app.use(
//     expressWinston.logger({
//       transports: [
//         new winston.transports.Console({
//           format: winston.format.simple(),
//           json: false,
//           colorize: true,
//         }),
//         new winston.transports.File({
//           filename: "config/success.log",
//           level: "success",
//           json: true,
//         }),
//       ],
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.json()
//       ),
//       meta: true,
//       msg:
//         " HTTP {{req.method}} {{req.url}} {{req.statusCode}} {{res.responseTime}}ms",
//       colorize: true,
//     })
//   );
// }

//authorize user through passport before api routes.

app.use(express.static("files"));
app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use('/product-types', productTypeRoutes);
app.use('/categories', categoryRoutes);
app.use('/brands', brandRoutes);

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const opts = Object.assign({
      errors: err.errors,
    });
    const error = Boom.badRequest("Validation Error", opts);
    return next(error);
  }
  return next(err);
});

app.all('/*', (req, res) => res.status(400).send({ success: false, message: 'Check Your Route path Address' }))

if (process.env.NODE_ENV !== "test") {
  app.use(
    expressWinston.errorLogger({
      transports: [
        new winston.transports.File({
          filename: "config/error.log",
          level: "error",
          json: false,
        }),
      ],
    })
  );
}

app.use((err, req, res, next) => {
  if (err.isBoom) {
    const payload = Object.assign(err);
    return res.status(err.statusCode).send(payload);
  }
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    statusCode: httpStatus.INTERNAL_SERVER_ERROR,
    error:
      process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? err.stack
        : "",
  });
});

if (process.env.NODE_ENV === "development") {
  mongoose
    .connect(process.env.MONGO_HOST + process.env.MONGODB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((result) => {
      console.log('MongoDB is Connected!');
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`Unable to connect to database ${process.env.MONGODB}`);
    });
  app.listen(process.env.PORT, () =>
    console.log(
      `Server started on port ${process.env.PORT} ${process.env.NODE_ENV}`
    )
  );
}

if (process.env.NODE_ENV === "test") {
  mongoose
    .connect(process.env.MONGO_HOST + process.env.MONGODB)
    .then((result) => {
      console.log('MongoDB is Connected!');
    })
    .catch((err) => {
      console.log(err);
      throw new Error(`Unable to connect to database ${process.env.MONGODB}`);
    });
  app.listen(process.env.MONGO_TEST_PORT, () =>
    console.log(
      `Server started on port ${process.env.MONGO_TEST_PORT} ${process.env.NODE_ENV}`
    )
  );
}
