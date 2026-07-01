import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, default: "" },
    size: { type: Number, default: 0 },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

mediaSchema.index({ uploaderId: 1, messageId: 1, groupId: 1 });

const Media = mongoose.model("Media", mediaSchema);
export default Media;
