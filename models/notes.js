const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

exports.Notes = mongoose.model("Notes", notesSchema);
