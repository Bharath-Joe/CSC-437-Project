// src/index.ts
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connect } from "./mongoConnect";
import recipies from "./services/recipies";
import { Recipe, Credential } from "ts-models";
import jwt from "jsonwebtoken";
import credentials from "./services/credentials";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connect("meal-maker");

// const router = express.Router();
// router.use(authenticateUser);

// router.use("/app");
// router.use("/app/:mealid");
// router.use("/create");
// router.use("/filters");
// router.use("/settings");
// router.use("/favorites");

function generateAccessToken(username: string) {
    console.log("Generating token for", username);
    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
        return Promise.reject("Token secret is not defined.");
    }
    return new Promise((resolve, reject) => {
        jwt.sign(
            { username: username },
            tokenSecret,
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

function authenticateUser(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    const tokenSecret = process.env.TOKEN_SECRET;
    if (!tokenSecret) {
        return Promise.reject("Token secret is not defined.");
    }
    if (!token) {
        res.status(401).end();
    } else {
        jwt.verify(token, tokenSecret, (error: any, decoded: any) => {
            if (decoded) {
                console.log("Decoded token", decoded);
                next();
            } else {
                res.status(401).end();
            }
        });
    }
}

app.post("/register", (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        credentials
            .create(username, password)
            .then((creds) => generateAccessToken(creds.username))
            .then((token) => {
                res.status(201).send({ token: token });
            });
    }
});

app.post("/login", (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        credentials
            .verify(username, password)
            .then((goodUser: string) => generateAccessToken(goodUser))
            .then((token) => res.status(200).send({ token: token }))
            .catch((error) => res.status(401).send("Unauthorized"));
    }
});

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

function applyFilters(queryParams: any, recipes: Recipe[]): Recipe[] {
    let filteredRecipes = [...recipes];
    console.log(queryParams);

    if (queryParams.selectedType) {
        filteredRecipes = filteredRecipes.filter(
            (recipe) => recipe.type === queryParams.selectedType
        );
    }

    if (queryParams.selectedCuisines) {
        const cuisines = queryParams.selectedCuisines.split(",");
        filteredRecipes = filteredRecipes.filter((recipe) =>
            cuisines.includes(recipe.cuisine)
        );
    }

    if (queryParams.excludedIngredients) {
        const excludedIngredients = queryParams.excludedIngredients.split(",");
        filteredRecipes = filteredRecipes.filter((recipe) => {
            const recipeIngredients = recipe.ingredients.map((ingredient) =>
                ingredient.toLowerCase()
            );
            return !excludedIngredients.some((excludedIngredient: string) =>
                recipeIngredients.some((recipeIngredient) =>
                    recipeIngredient.includes(excludedIngredient.toLowerCase())
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

    if (
        !isNaN(selectedMinTime) &&
        !isNaN(selectedMaxTime) &&
        (selectedMinTime !== 0 || selectedMaxTime !== 0)
    ) {
        filteredRecipes = filteredRecipes.filter(
            (recipe) =>
                recipe.time >= selectedMinTime && recipe.time <= selectedMaxTime
        );
    }

    return filteredRecipes;
}

app.get("/recipes", (req: Request, res: Response) => {
    recipies
        .index()
        .then((recipes: Recipe[]) => {
            const filteredRecipes = applyFilters(req.query, recipes);
            res.json(filteredRecipes);
        })
        .catch((err) => res.status(404).end());
});

app.get("/recipes/:name", (req: Request, res: Response) => {
    const { name } = req.params;
    recipies
        .get(name)
        .then((recipe: Recipe) => res.json(recipe))
        .catch((err) => res.status(404).end());
});

app.post("/recipes", (req: Request, res: Response) => {
    const newRecipe = req.body;
    recipies
        .create(newRecipe)
        .then((recipe: Recipe) => res.status(201).send(recipe))
        .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
