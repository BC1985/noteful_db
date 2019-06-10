const FolderServices = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },

  getFolderById(knex, id) {
    return knex
      .from("folders")
      .select("*")
      .where(id, "id")
      .first();
  },
  deleteFolder(knex, id) {
    return knex("folders")
      .where({ id })
      .delete();
  }
};
