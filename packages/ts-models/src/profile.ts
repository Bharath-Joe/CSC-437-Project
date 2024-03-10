import { Recipe } from ".";

export interface Profile {
    userid: string;
    favorites: Array<Recipe>;
    name: string;
    preferredCuisine?: string;
    favoriteMeal?: string;
}
