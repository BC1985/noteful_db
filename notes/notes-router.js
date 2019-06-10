const express = require("express");
const NotesServices = require("./note-services");
const notesRouter = express.Router();
const { makeNotesArray } = require("../data/notes-data");

notesRouter
  .route("/notes")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesServices.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(makeNotesArray));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name } = req.body;
    const newNote = { note_name };

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    NotesService.insertNote(req.app.get("db"), newNote)
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note));
      })
      .catch(next);

    notesRouter
      .route("/:note_id")
      .all((req, res, next) => {
        NotesServices.getNoteById(req.app.get("db"), req.params.note_id)
          .then(note => {
            if (!note) {
              return res.status(404).json({
                error: { message: `note doesn't exist` }
              });
            }
            res.note = note;
            next();
          })
          .catch(next);
      })
      .delete((req, res, next) => {
        NotesService.deleteNote(req.app.get("db"), req.params.note_id)
          .then(numRowsAffected => {
            res.status(204).end();
          })
          .catch(next);
      });
  });

module.exports = notesRouter;
