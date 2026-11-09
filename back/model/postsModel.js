const { db } = require("../databases/databaseContext.js");

const SELECT_BASE = `
  SELECT p.id, p.usuario_id, p.categoria, p.descricao, p.logradouro,
         p.bairro_id, b.nome AS bairro, p.latitude, p.longitude, p.foto,
         p.status, p.resposta_admin, p.criado_em,
         u.nome AS autor_nome, u.foto_perfil AS autor_foto
  FROM postagens p
  INNER JOIN users u ON u.id = p.usuario_id
  LEFT JOIN bairros b ON b.id = p.bairro_id
`;

async function Create({
  usuarioId,
  categoria,
  descricao,
  logradouro,
  bairroId,
  latitude,
  longitude,
  foto,
}) {
  const sql = `INSERT INTO postagens
    (usuario_id, categoria, descricao, logradouro, bairro_id, latitude, longitude, foto)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const [result] = await db.execute(sql, [
    usuarioId,
    categoria,
    descricao,
    logradouro,
    bairroId,
    latitude,
    longitude,
    foto,
  ]);
  return result.insertId;
}

async function GetById(id) {
  const [rows] = await db.execute(`${SELECT_BASE} WHERE p.id = ?`, [id]);
  return rows.length > 0 ? rows[0] : null;
}

async function List({ status } = {}) {
  if (status) {
    const [rows] = await db.execute(
      `${SELECT_BASE} WHERE p.status = ? ORDER BY p.id DESC`,
      [status],
    );
    return rows;
  }
  const [rows] = await db.execute(`${SELECT_BASE} ORDER BY p.id DESC`);
  return rows;
}

async function ListByUser(usuarioId) {
  const [rows] = await db.execute(
    `${SELECT_BASE} WHERE p.usuario_id = ? ORDER BY p.id DESC`,
    [usuarioId],
  );
  return rows;
}

async function UpdateStatus(id, status, respostaAdmin) {
  await db.execute(
    "UPDATE postagens SET status = ?, resposta_admin = ? WHERE id = ?",
    [status, respostaAdmin, id],
  );
}

async function Delete(id) {
  await db.execute("DELETE FROM postagens WHERE id = ?", [id]);
}

async function ObterOuCriarBairro(nome) {
  const [result] = await db.execute(
    "INSERT INTO bairros (nome) VALUES (?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)",
    [nome],
  );
  return result.insertId;
}

module.exports = {
  Create,
  GetById,
  List,
  ListByUser,
  UpdateStatus,
  Delete,
  ObterOuCriarBairro,
};
