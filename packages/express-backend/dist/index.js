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
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_credentials = __toESM(require("./services/credentials"));
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
app.use((0, import_cors.default)());
app.use(import_express.default.json());
(0, import_mongoConnect.connect)("meal-maker");
function generateAccessToken(username) {
  console.log("Generating token for", username);
  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    return Promise.reject("Token secret is not defined.");
  }
  return new Promise((resolve, reject) => {
    import_jsonwebtoken.default.sign(
      { username },
      tokenSecret,
      { expiresIn: "1d" },
      (error, token) => {
        if (error)
          reject(error);
        else
          resolve(token);
      }
    );
  });
}
function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  const tokenSecret = process.env.TOKEN_SECRET;
  if (!tokenSecret) {
    return Promise.reject("Token secret is not defined.");
  }
  if (!token) {
    res.status(401).end();
  } else {
    import_jsonwebtoken.default.verify(token, tokenSecret, (error, decoded) => {
      if (decoded) {
        console.log("Decoded token", decoded);
        next();
      } else {
        res.status(401).end();
      }
    });
  }
}
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    import_credentials.default.create(username, password).then((creds) => generateAccessToken(creds.username)).then((token) => {
      res.status(201).send({ token });
    });
  }
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    import_credentials.default.verify(username, password).then((goodUser) => generateAccessToken(goodUser)).then((token) => res.status(200).send({ token })).catch((error) => res.status(401).send("Unauthorized"));
  }
});
app.get("/hello", (req, res) => {
  res.send("Hello, World");
});
function applyFilters(queryParams, recipes) {
  let filteredRecipes = [...recipes];
  console.log(queryParams);
  if (queryParams.selectedType) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.type === queryParams.selectedType
    );
  }
  if (queryParams.selectedCuisines) {
    const cuisines = queryParams.selectedCuisines.split(",");
    filteredRecipes = filteredRecipes.filter(
      (recipe) => cuisines.includes(recipe.cuisine)
    );
  }
  if (queryParams.excludedIngredients) {
    const excludedIngredients = queryParams.excludedIngredients.split(",");
    filteredRecipes = filteredRecipes.filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map(
        (ingredient) => ingredient.toLowerCase()
      );
      return !excludedIngredients.some(
        (excludedIngredient) => recipeIngredients.some(
          (recipeIngredient) => recipeIngredient.includes(excludedIngredient.toLowerCase())
        )
      );
    });
  }
  if (parseInt(queryParams.selectedPrice) !== 2) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.cost === parseInt(queryParams.selectedPrice)
    );
  }
  var selectedMinTime = parseInt(queryParams.selectedMinTime);
  var selectedMaxTime = parseInt(queryParams.selectedMaxTime);
  if (selectedMaxTime < selectedMinTime) {
    selectedMaxTime = Number.MAX_SAFE_INTEGER;
  }
  if (!isNaN(selectedMinTime) && !isNaN(selectedMaxTime) && (selectedMinTime !== 0 || selectedMaxTime !== 0)) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.time >= selectedMinTime && recipe.time <= selectedMaxTime
    );
  }
  return filteredRecipes;
}
app.get("/recipes", (req, res) => {
  import_recipies.default.index().then((recipes) => {
    const filteredRecipes = applyFilters(req.query, recipes);
    res.json(filteredRecipes);
  }).catch((err) => res.status(404).end());
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
