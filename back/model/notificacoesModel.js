
const { db } = require("../databases/databaseContext.js");

class NotificacoesModel {
  // Cria uma notificação
  async Criar(usuarioId, postagemId, tipo, titulo, mensagem) {
    const sql = `
      INSERT INTO notificacoes
      (usuario_id, postagem_id, tipo, titulo, mensagem)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [resultado] = await db.execute(sql, [
      usuarioId,
      postagemId,
      tipo,
      titulo,
      mensagem,
    ]);

    return resultado.insertId;
  }

  // Notifica todos os administradores
  async CriarParaAdmins(postagemId, titulo, mensagem) {
    const sql = `
      INSERT INTO notificacoes
      (usuario_id, postagem_id, tipo, titulo, mensagem)
      SELECT id, ?, 'nova_ocorrencia', ?, ?
      FROM users
      WHERE tipo = 'admin'
    `;

    const [resultado] = await db.execute(sql, [
      postagemId,
      titulo,
      mensagem,
    ]);

    return resultado.affectedRows;
  }

  // Lista notificações do usuário
  async Listar(usuarioId) {
    const sql = `
      SELECT id, usuario_id, postagem_id, mensagem_id,
             tipo, titulo, mensagem, lida_em, criado_em
      FROM notificacoes
      WHERE usuario_id = ?
      ORDER BY criado_em DESC
    `;

    const [rows] = await db.execute(sql, [usuarioId]);
    return rows;
  }

  // Marca uma notificação como lida
  async MarcarLida(id, usuarioId) {
    const sql = `
      UPDATE notificacoes
      SET lida_em = CURRENT_TIMESTAMP
      WHERE id = ? AND usuario_id = ? AND lida_em IS NULL
    `;

    const [resultado] = await db.execute(sql, [id, usuarioId]);
    return resultado.affectedRows;
  }

  // Marca todas como lidas
  async MarcarTodasLidas(usuarioId) {
    const sql = `
      UPDATE notificacoes
      SET lida_em = CURRENT_TIMESTAMP
      WHERE usuario_id = ? AND lida_em IS NULL
    `;

    const [resultado] = await db.execute(sql, [usuarioId]);
    return resultado.affectedRows;
  }
}

module.exports = new NotificacoesModel();
