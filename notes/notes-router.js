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
      .then(() => {
        res.status(201);

        // .json(serializeNote(note));
      })
      .catch(next);

    notesRouter
      .route("/:note_id")
      .get((req, res, next) => {
        NotesServices.getNoteById(req.app.get("db"), req.params.note_id)
          .then(note => {
            // if (!note) {
            //   res.send(`note doesn't exist`).end()
            //   .json({error: { message: `note doesn't exist` }});
            // }
            res
              .status(200)
              .res.json(note)
              .end();
          })
          .catch(next);
      })
      .delete((req, res, next) => {
        NotesServices.deleteNote(req.app.get("db"), req.params.note_id)
          .then(() => {
            res
              .status(204)
              .send("deleted")
              .end();
          })
          .catch(next);
      });
  });

module.exports = notesRouter;
