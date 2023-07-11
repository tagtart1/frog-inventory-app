const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get counts of the items in our app

  const [numCategories, numItems] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Frog Inventory Overview",
    category_count: numCategories,
    item_count: numItems,
  });
});

exports.category_list = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY ITEMS");
};

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("IN PROGRESS CATEGORY CREATE GET");
});

exports.category_create_post = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY CREEAT PORT");
};

exports.category_delete_get = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY DELETE GET");
};

exports.category_delete_post = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY DELETE POST");
};

exports.category_update_get = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY UPDATE GET");
};

exports.category_update_post = (req, res, next) => {
  res.send("IN PROGRESS CATEGORY UPDATE POST");
};
