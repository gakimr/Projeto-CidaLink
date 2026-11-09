const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const { pastaUploads } = require("./utils/upload.js");

dotenv.config();
console.log("JWT_SECRET carregado?", !!process.env.JWT_SECRET);

const path = require("path");
const result = require("dotenv").config({ path: path.join(__dirname, ".env") });
const postsRoutes = require("./router/postsRoutes.js");
const bairrosRoutes = require("./router/bairrosRoutes.js");

if (result.error) {
  console.error("Não consegui ler o .env:", result.error.message);
} else {
  console.log(".env carregado de:", path.join(__dirname, ".env"));
}

const authRoutes = require("./router/authRoutes.js");
const { db } = require("./databases/databaseContext.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(pastaUploads));
app.use(authRoutes);
app.use(postsRoutes);
app.use(bairrosRoutes);

const Port = process.env.PORT || 3000;

async function startServer() {
  try {
    console.log(`Iniciando banco de dados: ${process.env.DB_TYPE || "mysql"}`);
    await db.init();

    app.listen(Port, () => {
      console.log(
        `Servidor rodando na porta: ${Port}\nPressione CTRL+C para cancelar o servidor!`,
      );
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
  }
}

startServer();
