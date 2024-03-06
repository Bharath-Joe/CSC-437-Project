"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recipe_exports = {};
__export(recipe_exports, {
  default: () => recipe_default
});
module.exports = __toCommonJS(recipe_exports);
var import_mongoose = require("mongoose");
const recipeSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    cuisine: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    time: { type: Number, required: true, trim: true },
    cost: { type: Number, required: true, trim: true },
    ingredients: { type: [String], required: true, trim: true },
    utensils: { type: [String], required: true, trim: true },
    steps: { type: [String], required: true, trim: true },
    src: { type: String, required: true, trim: true }
  },
  { collection: "recipies" }
);
const recipeModel = (0, import_mongoose.model)("Recipe", recipeSchema);
var recipe_default = recipeModel;
