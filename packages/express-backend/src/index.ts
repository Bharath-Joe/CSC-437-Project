// src/index.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { connect } from "./mongoConnect";
import recipies from "./services/recipies";
import { Recipe } from "ts-models";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
connect("meal-maker");

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/recipes", (req: Request, res: Response) => {
    recipies
        .index()
        .then((recipes: Recipe[]) => res.json(recipes))
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
