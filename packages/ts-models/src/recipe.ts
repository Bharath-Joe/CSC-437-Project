export interface Recipe {
    name: string;
    cuisine: string;
    description: string;
    type: string;
    ingredients: string[];
    utensils: string[];
    steps: string[];
    cost: number;
    time: number;
    src: string;
}