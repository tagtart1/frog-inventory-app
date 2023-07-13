const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.item_create_get = (req, res, next) => {
  res.send("WIP ITEM CREATE GET");
};

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
