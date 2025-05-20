const express = require("express");
const router = express.Router();
const { lerDB, salvarDB } = require("../utils/db");

// Listar solicitações por contato (consulta pública)
router.get("/", (req, res) => {
  const contato = req.query.contato;
  if (!contato) return res.json([]);
  const dados = lerDB();
  const resultado = dados.filter(item => item.contato === contato);
  res.json(resultado);
});

// Criar nova solicitação (registro público)
router.post("/", (req, res) => {
  const novaSolicitacao = req.body;
  const db = lerDB();
  db.push(novaSolicitacao);
  salvarDB(db);
  res.status(201).json(novaSolicitacao);
});

module.exports = router;
