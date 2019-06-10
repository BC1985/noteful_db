const express = require("express");
const folderServices = require("./folder-services");
const folderRouter = express.Router();
const { makeFoldersArray } = require("../data/folder-data");

folderRouter.route("/folders").get((req, res, next) => {
  const knexInstance = req.app.get("db");
  folderServices
    .getAllFolders(knexInstance)
    .then(res.json(makeFoldersArray))
    .catch(next);
});

module.exports = folderRouter;
