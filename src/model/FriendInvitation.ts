import mongoose, { Schema } from "mongoose";

export interface FriendInvitation {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<FriendInvitation>({
  senderId: { type: Schema.Types.ObjectId, ref: "User" },

  receiverId: { type: Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.model("FriendInvitation", userSchema);
