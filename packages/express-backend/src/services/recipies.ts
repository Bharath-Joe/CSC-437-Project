import { Document } from "mongoose";
import { Recipe } from "ts-models";
import recipeModel from "../mongo/recipe";

function index(): Promise<Recipe[]> {
    return recipeModel.find();
}

function get(name: String): Promise<Recipe> {
    return recipeModel
        .find({ name })
        .then((list) => list[0])
        .catch((err) => {
            throw `${name} Not Found`;
        });
}

function getbyId(_id: String): Promise<Recipe> {
    return recipeModel
        .find({ _id })
        .then((list) => list[0])
        .catch((err) => {
            throw `${name} Not Found`;
        });
}

function create(recipe: Recipe): Promise<Recipe> {
    const r = new recipeModel(recipe);
    return r.save();
}

export default {
    index,
    get,
    getbyId,
    create,
};
