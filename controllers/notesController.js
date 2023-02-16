const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const User = require('../models/User');

// @desc Get all notes
// @route GET /notes
// @access Private
const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    return res.status(400).json({ message: 'No Notes Found' });
  }

  res.json(notes);
});

// @desc Create new note
// @route POST /notes
// @access Private
const createNewNote = asyncHandler(async (req, res) => {
  const { userID, title, text } = req.body;

  const user = await User.findById(userID).select('-password').lean().exec();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (!title || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const note = await Note.create({ user, title, text });

  if (note) {
    return res.status(201).json({ message: 'New note created successfully' });
  } else {
    return res.status(400).json({ message: 'Invalid note data' });
  }
});

// @desc Update note
// @route PATCH /notes
// @access Private
const updateNote = asyncHandler(async (req, res) => {
  const { userID, title, text, noteID, completed } = req.body;

  const note = await Note.findById(noteID).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const user = await User.findById(userID).select('-password').lean();

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (title) {
    note.title = title;
  }

  if (text) {
    note.text = text;
  }

  if (completed) {
    note.completed = completed;
  }

  const updatedNote = await note.save();

  res.json(`${noteID} updated successfully`);
});

// @desc Delete note
// @route Delete /notes
// @access Private
const deleteNote = asyncHandler(async (req, res) => {
  const { noteID } = req.body;
  const note = await Note.findById(noteID).exec();

  if (!note) {
    return res.status(400).json({ message: 'Note not found' });
  }

  const deletedNote = await note.deleteOne();

  res.json(`${note.title} deleted successfully`);
});

module.exports = { getAllNotes, createNewNote, updateNote, deleteNote };
