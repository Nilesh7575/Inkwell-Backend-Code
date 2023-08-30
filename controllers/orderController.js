const orderModel = require("../models/orderModel");
const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer');
const aws = require('aws-sdk');
const PDFDocument = require('pdfkit');

const placeOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, orderStatus, customerName } = req.body;

    // Validate request body
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items must be a non-empty array" });
    }

    // Create and save the order to the database
    const order = await orderModel.create({
      items: items,
      customerName: customerName,
      totalAmount: totalAmount,
      orderStatus: orderStatus,
    });

    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const orderStatus = req.query.orderStatus || null;
    const customerName = req.query.customerName || null;
    const productName = req.query.productName || null;
    const startDate = req.query.startDate
      ? new Date(req.query.startDate)
      : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Build the query object for filtering
    const query = {};
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }
    if (customerName) {
      //   query.customerName = { $regex: customerName, $options: 'i' };
      query.customerName = { $regex: new RegExp(customerName, "i") };
    }
    if (productName) {
      // Use the dot notation to filter based on the nested productName
      query["items.productName"] = { $regex: new RegExp(productName, "i") };
    }
    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.createdAt = { $gte: startDate };
    } else if (endDate) {
      query.createdAt = { $lte: endDate };
    }

    // Fetch orders from the database with pagination
    const orders = await orderModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({ data: orders, totalCount: orders.length });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    console.log("In update api");
    const { orderId, orderStatus } = req.body;

    // Validate request body
    if (!orderId || !orderStatus || typeof orderStatus !== "string") {
      return res.status(400).json({ error: "Invalid request" });
    }

    // Check if the order exists
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order status and set the updatedBy field to the ID of the user who made the update
    order.orderStatus = orderStatus;
    //   order.updatedBy = req.user._id; // Assuming you have authenticated users and have access to the user ID through req.user._id

    // Save the updated order to the database
    await order.save();

    return res.status(200).json({
      data: order,
      message: "The data you provided had been updated.",
    });
  } catch (error) {
    next(error);
  }
};

const generateBill = async (req, res, next) => {
  try {
    console.log("In generTE BILL FUNCTION");
    const orderId = req.params.orderId
    console.log(orderId);
    // Retrieve the order information from the database
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Construct the correct file path relative to the script's directory
    const templatePath = path.join(__dirname, '..', 'views', 'finalBillTemplate.handlebars');

    // Read the HTML template file
    const template = fs.readFileSync(templatePath, 'utf-8');

    // Create an empty string to store the items HTML
    let itemsData = [];
    let casesSellPrice;
    let bottleSellPrice;
    let finalItemPrice;
    let taxableAmount;
    let CGST, SGST, roundedCgst, roundedSgst, roundedItemPriceWithTax;
    let itemPriceWithTax;
    let totalOrderValue = 0;
    let itemCount = 0;

    // Iterate through the items and generate HTML for each item
    for (const item of order.items) {
      casesSellPrice = item.agreedSP * item.cases;
      bottleSellPrice = item.agreedMRP * item.bottles;
      finalItemPrice = casesSellPrice + bottleSellPrice;
      taxableAmount = finalItemPrice - 0.70 * finalItemPrice;
      CGST = finalItemPrice - 0.82 * finalItemPrice;
      roundedCgst = Math.ceil(CGST * 100) / 100;
      roundedSgst = Math.ceil(CGST * 100) / 100;
      SGST = finalItemPrice - 0.82 * finalItemPrice;
      itemPriceWithTax = finalItemPrice + taxableAmount + roundedCgst + roundedSgst;
      roundedItemPriceWithTax = Math.ceil(itemPriceWithTax * 100) / 100;
      totalOrderValue = totalOrderValue + roundedItemPriceWithTax
      itemCount = itemCount + 1;
      
      itemsData.push({
        itemCount: itemCount,
        productName: item.productName,
        cases: item.cases,
        bottles: item.bottles,
        finalItemPrice: finalItemPrice,
        casePrice: item.agreedSP,
        bottlePrice: item.agreedMRP,
        taxableAmount: taxableAmount,
        CGST: roundedCgst,
        SGST: roundedSgst,
        itemPriceWithTax: roundedItemPriceWithTax
      });
    }
    
    console.log(totalOrderValue);
    // Populate placeholders in the template with order information
    const htmlContent = ejs.render(template, {
      orderId: order._id,
      customerName: order.customerName,
      totalAmount: order.totalAmount,
      items: itemsData,
      totalOrderValue: totalOrderValue
      // Add more data here
    });
    
    // Use puppeteer to generate a PDF from the HTML content
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf();
    await browser.close();

    // Initialize AWS SDK with your credentials and region
    const s3 = new aws.S3({
      accessKeyId: 'AKIAZXPAXMCELO5PB3RB',
      secretAccessKey: 'dTHAWpRS6zjZbCHoTDiH2TuQ/lO9ISDnDoFus/89',
      region: 'us-east-1'
    });

    // Create a PDF file name
    const pdfFileName = `${order.customerName}_${orderId}.pdf`;

    // Upload the PDF to Amazon S3 bucket
    const params = {
      Bucket: 'inkwell-track-it',
      Key: pdfFileName,
      Body: pdfBuffer
    };
    await s3.upload(params).promise();

    // Get the URL of the uploaded PDF
    const pdfUrl = s3.getSignedUrl('getObject', {
      Bucket: 'inkwell-track-it',
      Key: pdfFileName
    });

    // Return the PDF URL in the response
    res.json({
      "massege": "Your order has been delivered successfully, you can track invoice in documents section.",
      "data": {
        "pdfUrl": pdfUrl,
        "htmlContent": htmlContent 
      }
    });

    // Set response content type to HTML
    // res.setHeader('Content-Type', 'text/html');
    
    // Return the generated HTML bill
    // res.send(htmlContent);

    
  } catch (error) {
    console.log(error);
    next(error)
  }
}


//====================================== GET PRODUCT DETAILS=============================================
// const getProductDetails = async function (req, res) {
//   try {
//     let data = req.query;
//     let filter = { isDeleted: false };

//     // validation for the empty body
//     if (isValidRequestBody(data)) {
//       let { size, name, priceGreaterThan, priceLessThan, priceSort } = data; //destructuring of data object

//       // validation for size
//       if (size) {
//         size = size.toUpperCase();
//         if (!isValidSizes(size)) {
//           let givenSizes = ["S", "XS", "M", "X", "L", "XXL", "XL"];
//           return res.status(400).send({
//             status: false,
//             message: `size should be one from these only ${givenSizes}`,
//           });
//         } else {
//           size = size.split(",");

//           filter = { availableSizes: { $in: size } }; //find({ availableSizes: { $in: [val1, val2, val3] } })
//         }
//       }
//       // validation for name
//       if (name) {
//         name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
//         filter["title"] = { $regex: name }; //filter: { title: { $regex: "akshay" } }    check the substring
//       }

//       // validation for price
//       if (priceGreaterThan || priceLessThan) {
//         filter.price = {};

//         if (priceGreaterThan) {
//           if (!isValidPrice(priceGreaterThan))
//             return res.status(400).send({
//               status: false,
//               message: "priceGreaterThan should be valid",
//             });

//           priceGreaterThan = Number(priceGreaterThan);

//           filter.price.$gte = priceGreaterThan; // filter: { price: { $gt: value } }
//         }
//         if (priceLessThan) {
//           if (!isValidPrice(priceLessThan))
//             return res.status(400).send({
//               status: false,
//               message: "priceLessThan should be valid",
//             });

//           priceLessThan = Number(priceLessThan);
//           filter.price.$lte = priceLessThan; // filter: { price: { $lt: value } }

//           // Model.find({ $and: [{ field1: value1 }, { field2: { $gt: value2 } }] })
//           // Model.find({ $and: [{ field1: value1 }, { field2: { $gt: value2, $lt: value3 } }] })
//         }
//       }

//       if (priceGreaterThan && priceLessThan && priceGreaterThan > priceLessThan)
//         return res
//           .status(400)
//           .send({ status: false, message: "Invalid price range" });

//       // validation for price sorting
//       if (priceSort) {
//         if (!(priceSort == 1 || priceSort == -1)) {
//           return res.status(400).send({
//             status: false,
//             message: "In price sort it contains only 1 & -1",
//           });
//         }

//         const products = await productModel
//           .find(filter)
//           .sort({ price: priceSort });

//         if (!products)
//           return res
//             .status(404)
//             .send({ status: false, message: "No products found" });

//         return res
//           .status(200)
//           .send({ status: true, message: "Success", data: products });
//       }
//     }

//     // find collection without filters
//     const findData = await productModel.find(filter).sort({ price: 1 });
//     if (findData.length == 0)
//       return res
//         .status(404)
//         .send({ status: false, message: "No products found" });

//     return res
//       .status(200)
//       .send({ status: true, message: "Success", data: findData });
//   } catch (error) {
//     return res.status(500).send({ status: false, message: error.message });
//   }
// };

module.exports = { getAllOrders, placeOrder, updateOrderStatus, generateBill };
