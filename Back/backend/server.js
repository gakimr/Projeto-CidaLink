const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Carrega as configurações do próprio diretório do backend, independentemente
// da pasta de onde o comando npm start foi executado.
dotenv.config({ path: path.join(__dirname, ".env") });

const { pastaUploads } = require("./utils/upload.js");
const postsRoutes = require("./router/postsRoutes.js");
const bairrosRoutes = require("./router/bairrosRoutes.js");
const authRoutes = require("./router/authRoutes.js");
const { db } = require("./databases/databaseContext.js");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/uploads", express.static(pastaUploads));

// Rota simples para testar se o celular consegue alcançar o backend.
app.get("/", (_req, res) => {
  res.status(200).json({ message: "CidaLink API funcionando" });
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "CidaLink API" });
});

app.use(authRoutes);
app.use(postsRoutes);
app.use(bairrosRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET não foi configurado no arquivo Back/backend/.env");
    }
    console.log(`Iniciando banco de dados: ${process.env.DB_TYPE || "mysql"}`);
    await db.init();

    // 0.0.0.0 permite conexões de outros dispositivos na mesma rede.
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor CidaLink rodando na porta ${PORT}`);
      console.log(`Teste local: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error.message);
    process.exitCode = 1;
  }
}

startServer();
