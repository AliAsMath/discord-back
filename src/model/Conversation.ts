import { model, Schema, Types } from "mongoose";

interface Conversation {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
}

const conversationSchema = new Schema<Conversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model("Conversation", conversationSchema);
