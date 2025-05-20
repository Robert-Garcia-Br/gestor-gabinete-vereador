const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const solicitacoesRouter = require("./routes/solicitacoes");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rotas públicas (frontend)
app.use("/api/solicitacoes", solicitacoesRouter);
app.use("/admin/api", adminRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Rota padrão para frontend (opcional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Inicializa o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
