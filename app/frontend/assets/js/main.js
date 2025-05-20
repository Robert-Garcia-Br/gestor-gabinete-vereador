const form = document.getElementById("registroForm");
const tipoSelect = document.getElementById("tipo");
const anonimoCheckbox = document.getElementById("anonimo");
const anonimoContainer = document.getElementById("anonimoContainer");
const identificacaoCampos = document.getElementById("identificacaoCampos");
const formaContato = document.getElementById("formaContato");
const contatoInputContainer = document.getElementById("contatoInputContainer");

const alerta = document.getElementById("alerta");
const confirmDialog = document.getElementById("confirmDialog");
const resumoRegistro = document.getElementById("resumoRegistro");

let dadosTemporarios = null;

// Atualiza o campo de contato conforme a forma escolhida
formaContato.addEventListener("change", () => {
  const tipo = formaContato.value;
  let exemplo = tipo === "email" ? "exemplo@dominio.com" : "(99) 99999-9999";
  let inputType = tipo === "email" ? "email" : "tel";

  contatoInputContainer.innerHTML = `
    <label for="contato">${tipo === "email" ? "E-mail" : "Telefone"}</label>
    <input type="${inputType}" id="contato" name="contato" required placeholder="${exemplo}" />
    ${tipo === "tel" ? `
      <label>
        <input type="checkbox" id="whatsapp" /> Pode entrar em contato por WhatsApp
      </label>` : ""}
  `;
});

// Mostra/oculta campos de denúncia anônima
tipoSelect.addEventListener("change", () => {
  if (tipoSelect.value === "Denúncia") {
    anonimoContainer.style.display = "block";
  } else {
    anonimoContainer.style.display = "none";
    anonimoCheckbox.checked = false;
    identificacaoCampos.style.display = "block";
  }
});

anonimoCheckbox.addEventListener("change", () => {
  identificacaoCampos.style.display = anonimoCheckbox.checked ? "none" : "block";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipo = tipoSelect.value;
  const anonimo = anonimoCheckbox.checked;
  const nome = anonimo ? "Anônimo" : document.getElementById("nome").value;
  const contato = anonimo ? "" : document.getElementById("contato")?.value || "";
  const whatsapp = anonimo ? false : document.getElementById("whatsapp")?.checked || false;
  const mensagem = document.getElementById("mensagem").value;

  // Armazena para confirmação
  dadosTemporarios = { tipo, anonimo, nome, contato, whatsapp, mensagem };

  // Monta resumo
  resumoRegistro.innerHTML = `
    <p><strong>Tipo:</strong> ${tipo}</p>
    <p><strong>Nome:</strong> ${nome}</p>
    ${anonimo ? "<p><em>Denúncia anônima</em></p>" : `
      <p><strong>Contato:</strong> ${contato}</p>
      ${whatsapp ? "<p>✅ Pode ser contatado por WhatsApp</p>" : ""}
    `}
    <p><strong>Mensagem:</strong><br>${mensagem}</p>
  `;

  confirmDialog.style.display = "block";
});

// Se o usuário confirma, envia os dados
function confirmarEnvio() {
  const agora = new Date();
  const dataHora = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR').slice(0,5);
  const andamento = [`${dataHora} - Recebido pelo sistema`];

  const novaSolicitacao = {
    id: Date.now(),
    tipo: dadosTemporarios.tipo,
    nome: dadosTemporarios.nome,
    contato: dadosTemporarios.contato,
    mensagem: dadosTemporarios.mensagem,
    status: "Recebido",
    andamento, // campo andamento como array com data/hora e texto
    retorno: andamento[0]
  };

  // AJUSTE PARA LIVE SERVER: use endereço completo do backend
  fetch("http://localhost:3000/api/solicitacoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaSolicitacao),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erro ao registrar.");
      return res.json();
    })
    .then(() => {
      alerta.className = "alert success";
      alerta.innerText = "Registro enviado com sucesso!";
      alerta.style.display = "block";
      confirmDialog.style.display = "none";
      form.reset();
      contatoInputContainer.innerHTML = "";
      // mantém nome/contato se não for anônimo
      if (!dadosTemporarios.anonimo) {
        document.getElementById("nome").value = dadosTemporarios.nome;
        formaContato.value = dadosTemporarios.contato.includes("@") ? "email" : "telefone";
        formaContato.dispatchEvent(new Event("change"));
        setTimeout(() => {
          document.getElementById("contato").value = dadosTemporarios.contato;
          if (document.getElementById("whatsapp") && dadosTemporarios.whatsapp) {
            document.getElementById("whatsapp").checked = true;
          }
        }, 100);
      }
    })
    .catch(() => {
      alerta.className = "alert error";
      alerta.innerText = "Erro ao registrar a solicitação.";
      alerta.style.display = "block";
    });
}

// Cancela e volta ao formulário
function cancelarEnvio() {
  confirmDialog.style.display = "none";
}
