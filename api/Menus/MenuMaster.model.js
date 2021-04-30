const mongoose = require("mongoose");
const beautifyUnique = require("mongoose-beautiful-unique-validation");

const menuMasterSchema = new mongoose.Schema(
  {
    ProductID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductMaster",
    },
    MenuName: {
      type: String,
    },
    MenuType: {
      type: String,
    },
    WidgetName: {
      type: String,
    },
    WidgetInputs: [
      {
        type: String,
      },
    ],
    MenuDescription: {
      type: String,
    },
    SysDefault: {
      type: Boolean,
    },
    MenuIcon: {
      type: String,
    },
    MenuRelated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuMaster",
    },
  },
  {
    timestamps: true,
  }
);

menuMasterSchema.plugin(beautifyUnique);

module.exports = mongoose.model("MenuMaster", menuMasterSchema);
