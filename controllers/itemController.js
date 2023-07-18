const Category = require("../models/category");
const Item = require("../models/item");

const path = require("path");
const fs = require("fs").promises;

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, file.originalname + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("image");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const he = require("he");

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
  upload,
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
      imgpath: path.join("/images", req.file.filename),
    });

    if (!errors.isEmpty()) {
      // Re-render the form with the errors

      const allCategories = await Category.find({}, "name").exec();
      await fs.unlink(
        path.join(path.dirname(__dirname), "public", req.body.imgpath)
      ),
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

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  res.render("item_detail", {
    title: "Item details",
    item: item,
    deleteItem: true,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Promise.all([
    Item.findByIdAndDelete(req.body.itemid),
    fs.unlink(path.join(path.dirname(__dirname), "public", req.body.imgpath)),
  ]);

  res.redirect("/p/all");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).exec(),
    Category.find({}, "name").exec(),
  ]);
  item.description = he.decode(item.description);
  res.render("item_create", {
    title: "Update Item",
    category_list: allCategories,
    item: item,
    selected_category: item.category._id,
  });
});

exports.item_update_post = [
  upload,
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

    let ImgPath = "";
    // Define image path
    if (req.file) ImgPath = path.join("/images", req.file.filename);
    // Create item object
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      stock: req.body.stock,
      _id: req.params.id,
      imgpath: ImgPath,
    });

    if (!errors.isEmpty()) {
      // Re-render the form with the errors

      const allCategories = await Category.find({}, "name").exec();
      await fs.unlink(
        path.join(path.dirname(__dirname), "public", req.body.imgpath)
      ),
        res.render("item_create", {
          title: "Create Item",
          item: item,
          category_list: allCategories,
          selected_category: item.category._id,
          errors: errors.array(),
        });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category").exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }
  item.description = he.decode(item.description);
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
