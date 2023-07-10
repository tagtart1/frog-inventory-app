const express = require("express");
const router = express.Router();

// Require controller modules/.
const category_controller = require("../controllers/categoryController.js");

/// CATEGORY ROUTES ///

// GET home page
router.get("/", category_controller.index);

// GET request for creating a Category
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a Category
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Category
router.get(
  "/category/:name/:id/delete",
  category_controller.category_delete_get
);

// POST request to delete Category
router.post(
  "/category/:name/:id/delete",
  category_controller.category_delete_post
);

// GET request to update Category
router.get(
  "/category/:name/:id/update",
  category_controller.category_update_get
);

// POST request to update Category
router.post(
  "/category/:name/:id/update",
  category_controller.category_update_post
);

// GET request for list of all Category items.
router.get("/category/:name/:id", category_controller.category_list);

module.exports = router;
