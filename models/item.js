const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
  stock: { type: Number, required: true },
  imgpath: { type: String },
});

// Virtual for Item's url
ItemSchema.virtual("url").get(function () {
  let nospaceName = this.name.trim().replace(/\s+/g, "-").toLowerCase();
  return `/p/${nospaceName}/${this._id}`;
});

ItemSchema.virtual("formattedPrice").get(function () {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(this.price);
});

module.exports = mongoose.model("Item", ItemSchema);
