const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// GET item create form
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name").exec();

  res.render("item_create", {
    title: "Create Item",
    category_list: allCategories,
  });
});

// POST item create
exports.item_create_post = [
  // Validate and sanitize fields
  body("category", "Please select a category")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("name", "Please specify a name").trim().isLength({ min: 1 }).escape(),
  body("price")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please specify a price")
    .isFloat({ min: 0 })
    .withMessage("Enter a valid price"),
  body("stock")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Please enter a quantity stock")
    .isInt({ min: 0 })
    .withMessage("Please enter a valid quantity"),
  body("description", "Enter a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract errors
    const errors = validationResult(req);

    // Create item object
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // Re-render the form with the errors

      const allCategories = await Category.find({}, "name").exec();

      res.render("item_create", {
        title: "Create Item",
        item: item,
        category_list: allCategories,
        selected_category: item.category._id,
        errors: errors.array(),
      });
      return;
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

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

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_detail", {
    title: "Item details",
    item: item,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find().exec();

  res.render("item_all", {
    title: "All Products",
    allItems: allItems,
  });
});
