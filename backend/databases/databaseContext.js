const { pool } = require("../databases/connectionMysql.js");

class DatabaseContext {
  async init() {
    await pool.query("SELECT 1");
    console.log("Conectado com sucesso ao banco");
  }

  async execute(query, params) {
    return await pool.execute(query, params);
  }
}

const db = new DatabaseContext();

module.exports = { db };
