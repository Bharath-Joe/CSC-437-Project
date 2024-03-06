import { Schema, Model, Document, model } from "mongoose";
import { Recipe } from "ts-models";

const recipeSchema = new Schema<Recipe>(
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
        src: { type: String, required: true, trim: true },

    },
    { collection: "recipies" }
);

const recipeModel = model<Recipe>("Recipe", recipeSchema);

export default recipeModel;
