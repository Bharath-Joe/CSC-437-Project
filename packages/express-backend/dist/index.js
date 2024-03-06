"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_express = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_mongoConnect = require("./mongoConnect");
var import_recipies = __toESM(require("./services/recipies"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
(0, import_mongoConnect.connect)("meal-maker");
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
app.get("/recipes", (req, res) => {
  import_recipies.default.index().then((recipes) => res.json(recipes)).catch((err) => res.status(404).end());
});
app.get("/recipes/:name", (req, res) => {
  const { name } = req.params;
  import_recipies.default.get(name).then((recipe) => res.json(recipe)).catch((err) => res.status(404).end());
});
app.post("/recipes", (req, res) => {
  const newRecipe = req.body;
  import_recipies.default.create(newRecipe).then((recipe) => res.status(201).send(recipe)).catch((err) => res.status(500).send(err));
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
