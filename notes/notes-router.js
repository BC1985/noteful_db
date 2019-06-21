const express = require("express");
const { NotesServices } = require("./note-services");
const notesRouter = express.Router();
const jsonParser = express.json();

notesRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    NotesServices.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes);
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { note_name, content } = req.body;
    const newNote = { note_name, content };

    for (const [key, value] of Object.entries(newNote))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    NotesServices.createNote(req.app.get("db"), newNote)
      .then(note => {
        res
          .status(201)

          .json(serializeNote(note));
      })
      .catch(next);

    notesRouter
      .route("/api/:note_id")
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
          .then(() => {
            res.status(204).end();
          })
          .catch(next);
      });
  });

module.exports = notesRouter;
