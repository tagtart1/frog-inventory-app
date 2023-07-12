const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
});

CategorySchema.virtual("url").get(function () {
  let nospaceName = this.name.trim().replace(/\s+/g, "-").toLowerCase();
  return `/category/${nospaceName}/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
