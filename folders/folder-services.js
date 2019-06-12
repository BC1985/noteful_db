const FolderServices = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  getFolderById(knex, id) {
    return knex
      .from("folders")
      .select("*")
      .where("id", id)
      .first();
  },
  createFolder(knex, folder) {
    return knex("folders")
      .returning(["id", "name"])
      .insert(folder);
  },
  deleteFolder(knex, id) {
    return knex("folders")
      .where({ id })
      .delete();
  },
  updateFolder(knex, id, newFolderFields) {
    return knex("folders")
      .where("id", id)
      .update(newFolderFields);
  }
};

module.exports = { FolderServices };
