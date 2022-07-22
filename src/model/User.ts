import mongoose from "mongoose";

export interface User {
  mail: string;
  username: string;
  password: string;
  friends: mongoose.Schema.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>({
  mail: { type: String, unique: true },
  username: { type: String },
  password: { type: String },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export default mongoose.model("User", userSchema);
