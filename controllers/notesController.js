const { Notes } = require("../models/notes");

exports.createNotes = async (req, res) => {
  try {
    const { title, text } = req.body;

    if (!req.user) {
      return res.status(401).json({ error: "unauthorized to create notes" });
    }

    console.log(req.user);

    if (!title || !text) {
      return res.status(401).json({ error: "All fields are required" });
    }

    if (title.length > 20) {
      return res
        .status(401)
        .json({ error: "title must be less than of 20 characters" });
    }

    if (text.length > 2000) {
      return res.status(401).json({
        error: "text field length should be less than 2000 characters.",
      });
    }

    const notes = new Notes({ userId: req.user.id, title: title, text: text });

    const doc = await notes.save();

    res.status(201).json(doc);
  } catch (error) {
    console.log("error in createNotes ", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, title } = req.body;

    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to update notes" });
    }

    if (!text || !title) {
      return res.status(401).json({ error: "All fields required" });
    }

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(401).json({ error: "document not found." });
    }

    const updatedUser = await Notes.findByIdAndUpdate(
      id,
      { userId: req.user.id, title: title, text: text },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateNotes " + error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete note" });
    }

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(401).json({ error: "note not found" });
    }

    await Notes.findByIdAndDelete(id);

    res.status(200).json({ message: "note deleted successfully" });
  } catch (error) {
    console.log("error in delete note " + error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getNotesOrNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    let docs;

    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to get notes." });
    }

    if (noteId) {
      docs = await Notes.findById(noteId);
    } else {
      docs = await Notes.find();
    }

    if (!docs) {
      return res.status(401).json({ error: "No documents found" });
    }

    res.status(200).json(docs);
  } catch (error) {
    console.log("error in getNotesOrNote " + error.message);
    res.status(500).json({ error: error.message });
  }
};
