const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../utils/db");

// Listar todas as solicitações (admin)
router.get("/solicitacoes", (req, res) => {
  const dados = lerDB();
  res.json(dados);
});

// Atualizar uma solicitação (admin)
router.put("/solicitacoes/:id", (req, res) => {
  const id = Number(req.params.id);
  const db = lerDB();
  const idx = db.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).end();

  // Atualiza todos os campos recebidos, inclusive 'retorno' e 'andamento'
  db[idx] = { ...db[idx], ...req.body };

  salvarDB(db);
  res.json(db[idx]);
});

module.exports = router;
