const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const firmMasterSchema = new mongoose.Schema(
  {
    FirmEmail: {
      type: String,
      required: true,
      unique: true,
    },
    FirmName: {
      type: String,
    },
    type: {
      type: String,
    },
    Country: {
      type: String,
    },
    State: {
      type: String,
    },
    Currency: {
      type: String,
    },
    ProductPurchased: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ProductMaster",
        },
        availableTill: {
          type: Date,
        },
      },
    ],
    DBName: {
      type: String,
    },
    noOfAssociators: {
      type: Number,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

firmMasterSchema.plugin(beautifyUnique);

module.exports = mongoose.model("FirmMaster", firmMasterSchema);
