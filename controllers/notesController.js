const { Notes } = require("../models/notes");

exports.createNotes = async (req, res) => {
  try {
    const { userId, title, text } = req.body;

    if (!userId || !title || !text) {
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

    const notes = new Notes({ userId: userId, title: title, text: text });

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
    const { text, userId, title } = req.body;

    if (!text || !userId || !title) {
      return res.status(401).json({ error: "All fields required" });
    }

    const note = await Notes.findById(id);

    if (!note) {
      return res.status(401).json({ error: "document not found." });
    }

    const updatedUser = await Notes.findByIdAndUpdate(
      id,
      { userId: userId, title: title, text: text },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in updateNotes " + error.message);
    res.status(500).json({ error: error.message });
  }
};
