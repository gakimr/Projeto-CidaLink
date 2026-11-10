const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const pastaUploads = require("../utils/upload.js");

const authModel = require("../model/authmodel.js");

function gerarToken(user) {
  return jwt.sign(
    {
      id: user.id,
      tipo: user.tipo,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
  );
}

function formatarUser(user) {
  return {
    id: user.id,
    nome: user.nome,
    email: user.email,
    tipo: user.tipo,
    cpf: user.cpf,
    bairroId: user.bairro_id || null,
    latitude: user.latitude || "",
    longitude: user.longitude || "",
    fotoPerfil: user.foto_perfil || null,
  };
}

async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Error",
        data: "E-mail e senha são obrigatórios.",
      });
    }

    const user = await authModel.GetUSerbyEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Error",
        data: "E-mail ou senha incorretos.",
      });
    }

    const senhaValida = await bcrypt.compare(password, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        message: "Error",
        data: "E-mail ou senha incorretos.",
      });
    }

    const token = gerarToken(user);
    return res.status(200).json({
      message: "Success",
      data: {
        token,
        user: formatarUser(user),
      },
    });
  } catch (error) {
    console.error("Erro no authController (Login):", error);

    return res.status(500).json({
      message: "Error",
      data: "Erro interno no servidor.",
    });
  }
}

async function Cadastro(req, res) {
  try {
    const { nome, cpf, email, password, tipo, codigoAdmin } = req.body;

    if (!nome || !cpf || !email || !password) {
      return res.status(400).json({
        message: "Error",
        data: "Por favor, preencha todos os campos.",
      });
    }

    const querAdmin = tipo === "admin";

    if (
      querAdmin &&
      (!process.env.ADMIN_CODE || codigoAdmin !== process.env.ADMIN_CODE)
    ) {
      return res.status(403).json({
        message: "Error",
        data: "Código de administrador inválido.",
      });
    }

    const tipoFinal = querAdmin ? "admin" : "cidadao";

    const emailExistente = await authModel.GetUSerbyEmail(email);

    if (emailExistente) {
      return res.status(409).json({
        message: "Error",
        data: "Este e-mail já está cadastrado.",
      });
    }

    const senhaHash = await bcrypt.hash(password, 10);

    const novoId = await authModel.CreateUser({
      nome,
      cpf,
      email,
      senhaHash,
      tipo: tipoFinal,
    });

    // Gera o token
    const token = jwt.sign(
      {
        id: novoId,
        tipo: tipoFinal,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    return res.status(201).json({
      message: "Success",

      data: {
        token,

        usuario: {
          id: novoId,
          nome,
          email,
          tipo: tipoFinal,
          cpf,
        },
      },
    });
  } catch (error) {
    console.error("Erro no AuthController (Cadastro):", error);

    return res.status(500).json({
      message: "Error",
      data: "Erro interno no servidor.",
    });
  }
}
async function AtualizarPerfil(req, res) {
  try {
    const { nome, email, latitude, longitude } = req.body;

    if (!nome || !email) {
      return res.status(400).json({
        message: "Error",
        data: "Nome e e-mail são obrigatórios.",
      });
    }

    const emailEmUso = await authModel.GetUSerbyEmail(email);
    if (emailEmUso && emailEmUso.id !== req.usuario.id) {
      return res.status(409).json({
        message: "Error",
        data: "Este e-mail já está em uso.",
      });
    }

    await authModel.UpdateUser(req.usuario.id, {
      nome,
      email,
      latitude,
      longitude,
    });
    const atualizado = await authModel.GetUserById(req.usuario.id);

    return res.status(200).json({
      message: "Success",
      data: { user: formatarUser(atualizado) },
    });
  } catch (error) {
    console.error("Erro no AuthController (AtualizarPerfil):", error);
    return res.status(500).json({
      message: "Error",
      data: "Erro interno no servidor.",
    });
  }
}

async function AtualizarFoto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Error",
        data: "Nenhuma foto enviada",
      });
    }

    const atual = await authModel.GetUserById(req.usuario.id);
    const newPath = `/uploads/${req.file.filename}`;

    await authModel.UpdateFotoPerfil(req.usuario.id, newPath);

    if (atual?.foto_perfil) {
      const antiga = path.join(pastaUploads, path.basename(atual.foto_perfil));
      fs.unlink(antiga, () => {});
    }

    const atualizado = await authModel.GetUserById(req.usuario.id);

    return res.status(200).json({
      message: "Sucess",
      data: { user: formatarUser(atualizado) },
    });
  } catch (error) {
    console.error("Erro no AuthController (AtualizarFoto):", error);
    return res.status(500).json({
      message: "Error",
      data: "Erro interno no servidor.",
    });
  }
}

module.exports = { Login, Cadastro, AtualizarPerfil, AtualizarFoto };
