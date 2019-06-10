const express = require("express");
const FolderServices = require("./folder-services");
const folderRouter = express.Router();
const { makeFoldersArray } = require("../data/folder-data");
const xss = require("xss");
const jsonParser = express.json();

folderRouter
  .route("/folders")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    folderServices
      .getAllFolders(knexInstance)
      .then(res.json(makeFoldersArray))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };

    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    FolderServices.insert(req.app.get("db"), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeNote(folder));
      })
      .catch(next);

    folderRouter
      .route("/:folder_id")
      .all((req, res, next) => {
        FolderServices.getFolderById(req.app.get("db"), req.params.folder_id)
          .then(folder => {
            if (!folder) {
              return res.status(404).json({
                error: { message: `folder doesn't exist` }
              });
            }
            res.folder = folder;
            next();
          })
          .catch(next);
      })
      .delete((req, res, next) => {
        FolderServices.deleteFolder(req.app.get("db"), req.params.folder_id)
          .then(numRowsAffected => {
            res.status(204).end();
          })
          .catch(next);
      });
  });

module.exports = folderRouter;
