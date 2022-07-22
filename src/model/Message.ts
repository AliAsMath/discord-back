import { model, Schema, Types } from "mongoose";

interface Message {
  author: Types.ObjectId;
  content: string;
  date: Date;
  type: "DIRECT" | "GROUP";
}

const messageSchema = new Schema<Message>({
  author: { type: Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  date: { type: Date },
  type: { type: String },
});

export default model("Message", messageSchema);
