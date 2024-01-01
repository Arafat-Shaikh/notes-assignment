const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    userId: { type: String },
  },
  { timestamps: true }
);

exports.Notes = mongoose.model("Notes", notesSchema);
