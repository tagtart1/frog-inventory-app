const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// GET item creat form
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).exec();

  res.render("item_create", {
    title: "Create Item",
    category_list: allCategories,
  });
});

exports.item_create_post = (req, res, next) => {
  res.send("WIP ITEM CREATE POST");
};

exports.item_delete_get = (req, res, next) => {
  res.send("WIP ITEM DELETE GET");
};

exports.item_delete_post = (req, res, next) => {
  res.send("WIP ITEM DELETE GET");
};

exports.item_update_get = (req, res, next) => {
  res.send("WIP ITEM UPDATE GET");
};

exports.item_update_post = (req, res, next) => {
  res.send("WIP ITEM UPDATE POST");
};

exports.item_detail = (req, res, next) => {
  res.send("WIP ITEM DETAIL GET");
};

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().exec();

  res.render("item_all", {
    title: "All Products",
    allItems: allItems,
  });
});
