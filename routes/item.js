const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

/// ITEM ROUTES ///

// GET request for creating new Items
router.get("/create", item_controller.item_create_get);

// POST request for creating new Items
router.post("/create", item_controller.item_create_post);

// GET request for deleting Items
router.get("/:name/:id/delete", item_controller.item_delete_get);

// POST request for deleting Items
router.post("/:name/:id/delete", item_controller.item_delete_post);

// GET request to update Item
router.get("/:name/:id/update", item_controller.item_update_get);

//POST request to update Item
router.post("/:name/:id/update", item_controller.item_update_post);

// GET request for Item details
router.get("/:name/:id", item_controller.item_detail);

// GET request for all items
router.get("/all", item_controller.item_list);

module.exports = router;
