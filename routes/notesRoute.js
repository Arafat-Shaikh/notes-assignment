const express = require("express");
const { createNotes } = require("../controllers/notesController");
const router = express.Router();

router.post("/create", createNotes);

exports.router = router;
