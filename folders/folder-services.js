const folderServices = {
  getAllFolders(knex) {
    return knex.select("*").from("folders");
  },
  getAllNotes(knex) {
    return knex.select("*").from("notes");
  }
};
