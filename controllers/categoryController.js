const Category = require("../models/category");
const Item = require("../models/item");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get counts of the items in our app
  // CATEGORIES SHOULD BE MOVES TO THE LAYOUT NAVBAR!!!!
  const [numCategories, numItems, categories] = await Promise.all([
    Category.countDocuments({}).exec(),
    Item.countDocuments({}).exec(),
    Category.find({}).exec(),
  ]);

  res.render("index", {
    title: "Frog Inventory Overview",
    category_count: numCategories,
    item_count: numItems,
    categories: categories,
  });
});

exports.category_list = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_items", {
    category: category,
    categoryItems: itemsInCategory,
  });
});

exports.category_create_get = (req, res, next) => {
  res.render("category_create", { title: "Create Category" });
};

// Handle Genre create on POST
exports.category_create_post = [
  // Validate and sanitize the name fields.
  body("name", "Category must have atleast 3 character")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with the data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      // Data is valid
      const categoryExists = await Category.findOne({
        name: req.body.name,
      }).exec();
      if (categoryExists) {
        // Category already exists, redirect
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, itemsInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec(),
  ]);

  res.render("category_items", {
    categoryItems: itemsInCategory,
    deleteCategory: true,
    category: category,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Promise.all([
    Item.deleteMany({ category: req.body.categoryid }),
    Category.findByIdAndDelete(req.body.categoryid),
  ]);

  res.redirect("/");
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (category === null) {
    const err = new Error("Category not found!");
    err.status = 404;
    return next(err);
  }

  res.render("category_create", {
    title: "Update Category",
    category: category,
  });
});

exports.category_update_post = [
  // Validate and sanitize the name fields.
  body("name", "Category must have atleast 3 character")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  body("description", "Category must have a description")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // Create a category object with the data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
    } else {
      // Data is valid
      const categoryExists = await Category.findOne({
        name: req.body.name,
        description: req.body.description,
      }).exec();
      if (categoryExists) {
        // Category already exists, redirect
        res.redirect(categoryExists.url);
      } else {
        const updatedCategory = await Category.findByIdAndUpdate(
          req.params.id,
          category,
          {}
        );
        res.redirect(updatedCategory.url);
      }
    }
  }),
];
