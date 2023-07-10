#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Category = require("./models/category");
const Item = require("./models/item");

const categories = [];
const items = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function itemCreate(name, description, price, category, stock, index) {
  const itemdetail = {
    name: name,
    description: description,
    price: price,
    category: category,
    stock: stock,
  };

  const item = new Item(itemdetail);
  await item.save();
  items[index] = item;
  console.log(`Added item: ${item.name}`);
}

async function categoryCreate(name, description, index) {
  const categorydetail = {
    name: name,
    description: description,
  };

  const category = new Category(categorydetail);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(
      "Food",
      "Healthy and snack food types for any kind of frog species",
      0
    ),
    categoryCreate("Frog", "Live frogs to order, shipped via cryo-chamber", 1),
    categoryCreate(
      "Equipment",
      "Household and habitat equipiment to keep your frog happy and healthy",
      2
    ),
  ]);
}

async function createItems() {
  console.log("Creating Items");
  await Promise.all([
    itemCreate(
      "Pacific Tree Frog",
      "Small, green frog native to the Pacific Northwest.",
      14.99,
      categories[1],
      20,
      0
    ),

    itemCreate(
      "Green Tree Frog",
      "Popular pet frog, green with small white stripes.",
      12.99,
      categories[1],
      25,
      1
    ),

    itemCreate(
      "Poison Dart Frog",
      "Exotic frog, many bright colors. Requires special handling.",
      39.99,
      categories[1],
      10,
      2
    ),

    itemCreate(
      "Frog Chow",
      "Healthy and nutritious food, specially formulated for frogs.",
      8.99,
      categories[0],
      50,
      3
    ),

    itemCreate(
      "Live Crickets",
      "Live food source, loved by all frogs.",
      4.99,
      categories[0],
      100,
      4
    ),

    itemCreate(
      "Aquarium",
      "Large, glass habitat. Perfect for setting up a frog home.",
      49.99,
      categories[2],
      15,
      5
    ),

    itemCreate(
      "Water Filter",
      "Keeps the water in your frog's habitat clean.",
      19.99,
      categories[2],
      30,
      6
    ),

    itemCreate(
      "Heat Lamp",
      "Provides necessary warmth for your frog's habitat.",
      24.99,
      categories[2],
      20,
      7
    ),

    itemCreate(
      "Humidity Monitor",
      "Ensures the proper humidity in your frog's habitat.",
      14.99,
      categories[2],
      20,
      8
    ),

    itemCreate(
      "Decorative Plants",
      "Makes your frog's habitat feel like the wild.",
      9.99,
      categories[2],
      40,
      9
    ),
  ]);
}
