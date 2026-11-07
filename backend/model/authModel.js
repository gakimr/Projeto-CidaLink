const { db } = require("../databases/databaseContext.js");

async function GetUSerbyEmail(email) {
  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.execute(sql, [email]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Erro SQL no authModel (GetUserbyEmail):", error);

    throw error;
  }
}

async function GetUserbycpf(cpf) {
  try {
    const sql = "SELECT * FROM users WHERE cpf = ?";
    const [rows] = await db.execute(sql, [cpf]);

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Erro SQL no authModel (GetUserbyCpf):", error);

    throw error;
  }
}

async function CreateUser({ nome, cpf, email, senhaHash, tipo }) {
  try {
    const sql = `
            INSERT INTO users(nome, cpf, email, senha, tipo)
            VALUES (?, ?, ?, ?, ?)
        `;

    const [result] = await db.execute(sql, [nome, cpf, email, senhaHash, tipo]);

    return result.insertId;
  } catch (error) {
    console.error("Erro SQL no authModel (CreateUser):", error);

    throw error;
  }
}

async function GetUserById(id) {
  const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
  return rows.length > 0 ? rows[0] : null;
}

async function UpdateUser(id, { nome, email, latitude, longitude }) {
  const sql = `UPDATE users
               SET nome = ?, email = ?, latitude = ?, longitude = ?
               WHERE id = ?`;
  await db.execute(sql, [nome, email, latitude || null, longitude || null, id]);
}

async function UpdateFotoPerfil(id, path) {
  await db.execute("UPDATE users SET foto_perfil = ? WHERE id = ? ", [
    path,
    id,
  ]);
}

module.exports = {
  GetUSerbyEmail,
  GetUserbycpf,
  CreateUser,
  GetUserById,
  UpdateUser,
  UpdateFotoPerfil,
};
