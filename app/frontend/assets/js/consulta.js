document.addEventListener("DOMContentLoaded", () => {
  const formConsulta = document.getElementById("formConsulta");
  const contatoTipoSelect = document.getElementById("contatoConsultaTipo");
  const contatoInput = document.getElementById("contatoConsulta");
  const resultadosDiv = document.getElementById("resultados");

  contatoTipoSelect.addEventListener("change", () => {
    if (contatoTipoSelect.value === "email") {
      contatoInput.type = "email";
      contatoInput.placeholder = "exemplo@dominio.com";
      contatoInput.value = "";
    } else if (contatoTipoSelect.value === "telefone") {
      contatoInput.type = "tel";
      contatoInput.placeholder = "(99) 99999-9999";
      contatoInput.value = "";
    } else {
      contatoInput.type = "text";
      contatoInput.placeholder = "Selecione o tipo de contato";
      contatoInput.value = "";
    }
  });

  formConsulta.addEventListener("submit", async (e) => {
    e.preventDefault();

    const tipo = document.getElementById("contatoConsultaTipo").value;
    const contato = document.getElementById("contatoConsulta").value;

    // AJUSTE PARA LIVE SERVER: use endereço completo do backend
    const url = `http://localhost:3000/api/solicitacoes?contato=${encodeURIComponent(contato)}`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error("Erro ao consultar solicitações");
      }
      const data = await resp.json();

      const resultados = document.getElementById("resultados");
      if (data.length === 0) {
        resultados.innerHTML =
          "<p>Nenhuma solicitação encontrada para este contato.</p>";
      } else {
        resultados.innerHTML = data
          .map(
            (item) => `
          <div class="resultado">
            <strong>Tipo:</strong> ${item.tipo}<br>
            <strong>Status:</strong> ${item.status}<br>
            <strong>Mensagem:</strong> ${item.mensagem}<br>
            <strong>Retorno:</strong> ${item.retorno || "---"}
          </div>
          <hr>
        `
          )
          .join("");
      }
    } catch (err) {
      document.getElementById("resultados").innerHTML =
        '<p style="color:red;">Erro ao consultar solicitações.</p>';
    }
  });
});
