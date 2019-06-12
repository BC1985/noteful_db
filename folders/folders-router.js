const express = require("express");
const { FolderServices } = require("./folder-services");
const folderRouter = express.Router();
const { makeFoldersArray } = require("../data/folder-data");
const xss = require("xss");
const jsonParser = express.json();

folderRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    FolderServices.getAllFolders(knexInstance)
      .then(folders => res.json(folders))
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const newFolder = { name };
    console.log("====================================");
    console.log(newFolder);
    console.log("====================================");
    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    FolderServices.createFolder(req.app.get("db"), newFolder)
      .then(folders => {
        res.status(201).json(folders[0]);
      })
      .catch(next);
  });
folderRouter
  .route("/:folder_id")
  .get((req, res, next) => {
    //WHAT DOES REQ.APP.GET ACTUALLY DO?
    FolderServices.getFolderById(req.app.get("db"), req.params.folder_id)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `folder doesn't exist` }
          });
        }
        res.json(folder);
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    FolderServices.deleteFolder(req.app.get("db"), req.params.folder_id)
      .then(numRowsAffected => {
        res.send("deleted").end();
      })
      .catch(next);
  })
  .put(jsonParser, (req, res, next) => {
    const { name } = req.body;
    const folderToUpdate = { name };
    console.log("====================================");
    console.log(folderToUpdate);
    console.log("====================================");
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain name`
        }
      });

    FolderServices.updateFolder(
      req.app.get("db"),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res
          .status(204)
          .send("updated")
          .end();
      })
      .catch(next);
  });
module.exports = folderRouter;
