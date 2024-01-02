const { Notes } = require("../models/notes");

//  Create a new note.

//   Expects:
//    {
//      "title": "Note Title",
//      "text": "Note content"
//    }

// Endpoint: POST / api / notes / create;
exports.createNotes = async (req, res) => {
  try {
    const { title, text } = req.body;

    //  Check if the user is authenticated

    if (!req.user) {
      return res.status(401).json({ error: "unauthorized to create notes" });
    }

    // Validate input fields
    if (!title || !text) {
      return res.status(401).json({ error: "All fields are required" });
    }

    // Validate title length
    if (title.length > 20) {
      return res
        .status(401)
        .json({ error: "title must be less than of 20 characters" });
    }

    // Validate text length
    if (text.length > 2000) {
      return res.status(401).json({
        error: "text field length should be less than 2000 characters.",
      });
    }

    // Create a new note
    const notes = new Notes({ userId: req.user.id, title: title, text: text });

    // Save the new note to the database
    const doc = await notes.save();

    // Respond with the created note
    res.status(201).json(doc);
  } catch (error) {
    // Handle any errors during note creation
    console.log("error in createNotes ", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update an existing note.

// Expects:
//   {
//  "title": "Updated Title",
//  "text": "Updated content"
//  }

//  Endpoint: PATCH /api/notes/update/:id

exports.updateNotes = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, title } = req.body;

    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to update notes" });
    }

    // Validate input fields
    if (!text || !title) {
      return res.status(401).json({ error: "All fields required" });
    }

    // Find the note by ID
    const note = await Notes.findById(id);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "document not found." });
    }

    // Update the existing note
    const updatedUser = await Notes.findByIdAndUpdate(
      id,
      { userId: req.user.id, title: title, text: text },
      { new: true }
    );

    // Respond with the updated note
    res.status(200).json(updatedUser);
  } catch (error) {
    // Handle any errors during note update
    console.log("error in updateNotes " + error.message);
    res.status(500).json({ error: error.message });
  }
};

//  Delete a note by ID.

//  Endpoint: DELETE /api/notes/delete/:id

exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to delete note" });
    }

    // Find the note by ID
    const note = await Notes.findById(id);

    // Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "note not found" });
    }

    // Delete the note
    await Notes.findByIdAndDelete(id);

    // Respond with success message
    res.status(200).json({ message: "note deleted successfully" });
  } catch (error) {
    // Handle any errors during note deletion
    console.log("error in delete note " + error.message);
    res.status(500).json({ error: error.message });
  }
};

//  Get a list of notes or a specific note by ID.

//    Expects:
//    {
//      "noteId": "noteId"  // Optional
//    }
//  Endpoint: GET /api/notes/

exports.getNotesOrNote = async (req, res) => {
  try {
    const { noteId } = req.body;

    let docs;

    // Check if the user is authenticated
    if (!req.user) {
      return res
        .status(401)
        .json({ error: "you are not authorized to get notes." });
    }

    // Retrieve notes
    if (noteId) {
      docs = await Notes.findById(noteId);
    } else {
      docs = await Notes.find();
    }

    // Check if any notes are found
    if (!docs) {
      return res.status(404).json({ error: "No documents found" });
    }

    // Respond with the retrieved notes
    res.status(200).json(docs);
  } catch (error) {
    // Handle any errors during note retrieval
    console.log("error in getNotesOrNote " + error.message);
    res.status(500).json({ error: error.message });
  }
};
