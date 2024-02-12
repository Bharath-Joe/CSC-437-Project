// src/models/mongo/profile.ts
import { Schema, Model, Document, model } from "mongoose";
import { Profile } from "../profile";

const profileSchema = new Schema<Profile>(
  {
    userid: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    nickname: { type: String, trim: true },
    preferredCuisine: { type: String, required: true, trim: true },
    favoriteMeal: {type: String, trim: true},
    cookingSkillLevel: {type: Number, trim: true}
  },
  { collection: "user_profiles" }
);

const ProfileModel = model<Profile>("Profile", profileSchema);

export default ProfileModel;