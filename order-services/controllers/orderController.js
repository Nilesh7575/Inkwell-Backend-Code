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



module.exports = { getAllOrders, placeOrder, updateOrderStatus, generateBill };
