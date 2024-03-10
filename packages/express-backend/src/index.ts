// src/index.ts
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { connect } from "./mongoConnect";
import recipies from "./services/recipies";
import { Recipe, Credential, Profile } from "ts-models";
import jwt from "jsonwebtoken";
import credentials from "./services/credentials";
import profiles from "./services/profiles";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connect("meal-maker");

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
                next();
            } else {
                res.status(401).end();
            }
        });
    }
}

app.post("/register", async (req: Request, res: Response) => {
    console.log(req.body);
    const { name, preferredCuisine, favoriteMeal, username, password } =
        req.body;
    var favorites: Recipe[] = [];
    const newProfile = {
        userid: username,
        favorites: favorites,
        name: name,
        preferredCuisine: preferredCuisine,
        favoriteMeal: favoriteMeal,
    };
    if (!username || !password) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
        try {
            const creds = await credentials.create(username, password);
            const token = await generateAccessToken(creds.username);
            res.status(201).send({ token: token });
            await profiles.create(newProfile);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
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

app.get("/recipes", authenticateUser, (req: Request, res: Response) => {
    recipies
        .index()
        .then((recipes: Recipe[]) => {
            const filteredRecipes = applyFilters(req.query, recipes);
            res.json(filteredRecipes);
        })
        .catch((err) => res.status(404).end());
});

app.get("/profiles/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    profiles
        .get(userid)
        .then((profile: Profile) => res.json(profile))
        .catch((err) => res.status(404).end());
});

app.put("/profiles/favorites/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    const newRecipe = req.body;
    profiles
        .addFavorite(userid, newRecipe)
        .then((profile: Profile) => res.json(profile))
        .catch((err) => res.status(404).end());
});

app.put("/profiles/favorites/remove/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    const newRecipe = req.body;
    profiles
        .removeFavorite(userid, newRecipe)
        .then((profile: Profile) => res.json(profile))
        .catch((err) => res.status(404).end());
});

app.get("/recipes/id/:_id", (req: Request, res: Response) => {
    const { _id } = req.params;
    recipies
        .getbyId(_id)
        .then((recipe: Recipe) => res.json(recipe))
        .catch((err) => res.status(404).end());
});

app.get("/recipes/:name", (req: Request, res: Response) => {
    const { name } = req.params;
    recipies
        .get(name)
        .then((recipe: Recipe) => res.json(recipe))
        .catch((err) => res.status(404).end());
});


app.post("/recipes", authenticateUser, (req: Request, res: Response) => {
    const newRecipe = req.body;
    recipies
        .create(newRecipe)
        .then((recipe: Recipe) => res.status(201).send(recipe))
        .catch((err) => res.status(500).send(err));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
