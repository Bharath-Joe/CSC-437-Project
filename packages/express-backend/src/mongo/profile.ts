import { Schema, Model, Document, model } from "mongoose";
import { Profile, Recipe } from "ts-models";

const profileSchema = new Schema<Profile>(
    {
        userid: { type: String, required: true, trim: true },
        favorites: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Recipe",
            },
        ],
        name: { type: String, required: true, trim: true },
        preferredCuisine: { type: String, trim: true },
        favoriteMeal: { type: String, trim: true },
    },
    { collection: "user_profiles" }
);

const ProfileModel = model<Profile>("Profile", profileSchema);

export default ProfileModel;
