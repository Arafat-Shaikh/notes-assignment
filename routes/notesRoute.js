const express = require("express");
const {
  createNotes,
  updateNotes,
  deleteNote,
  getNotesOrNote,
} = require("../controllers/notesController");
const { authRoute } = require("../services/authRoute");
const router = express.Router();

router
  .post("/create", authRoute, createNotes)
  .patch("/update/:id", authRoute, updateNotes)
  .delete("/delete/:id", authRoute, deleteNote)
  .get("/", authRoute, getNotesOrNote);

exports.router = router;
