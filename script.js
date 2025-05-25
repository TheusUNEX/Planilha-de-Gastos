document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("gastoForm");
  const listaGastos = document.getElementById("listaGastos");
  const btnFiltrar = document.getElementById("btnFiltrar");

  const filtroAno = document.getElementById("filtroAno");
  const filtroMes = document.getElementById("filtroMes");
  const filtroCategoria = document.getElementById("filtroCategoria");

  let gastos = JSON.parse(localStorage.getItem("gastos")) || [];
  let editandoIndex = null;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const ano = document.getElementById("ano").value;
    const mes = document.getElementById("mes").value;
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value).toFixed(2);

    const novoGasto = { ano, mes, categoria, descricao, valor };

    if (editandoIndex !== null) {
      gastos[editandoIndex] = novoGasto;
      editandoIndex = null;
    } else {
      gastos.push(novoGasto);
    }

    localStorage.setItem("gastos", JSON.stringify(gastos));
    form.reset();
    renderizarGastos(gastos);
  });

  btnFiltrar.addEventListener("click", () => {
    const ano = filtroAno.value;
    const mes = filtroMes.value;
    const categoria = filtroCategoria.value;

    const gastosFiltrados = gastos.filter(gasto => {
      return (
        (ano === "" || gasto.ano === ano) &&
        (mes === "" || gasto.mes === mes) &&
        (categoria === "" || gasto.categoria === categoria)
      );
    });

    renderizarGastos(gastosFiltrados);
  });

  function renderizarGastos(lista) {
    listaGastos.innerHTML = "";

    if (lista.length === 0) {
      listaGastos.innerHTML = "<p class='text-center mt-4'>Nenhum gasto encontrado.</p>";
      return;
    }

    const tabela = document.createElement("table");
    tabela.className = "table table-striped table-dark mt-4";
    const tbody = lista.map((gasto, index) => `
      <tr>
        <td>${gasto.ano}</td>
        <td>${gasto.mes}</td>
        <td>${gasto.categoria}</td>
        <td>${gasto.descricao}</td>
        <td>${Number(gasto.valor).toFixed(2)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1 editar-btn" data-index="${index}">Editar</button>
          <button class="btn btn-sm btn-danger excluir-btn" data-index="${index}">Excluir</button>
        </td>
      </tr>
    `).join("");

    tabela.innerHTML = `
      <thead>
        <tr>
          <th>Ano</th>
          <th>Mês</th>
          <th>Categoria</th>
          <th>Descrição</th>
          <th>Valor (R$)</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${tbody}</tbody>
    `;

    const total = lista.reduce((acc, gasto) => acc + parseFloat(gasto.valor), 0);
    const totalHTML = `
      <div class="mt-3 text-end">
        <h5>Total: R$ ${total.toFixed(2)}</h5>
      </div>
    `;

    listaGastos.appendChild(tabela);
    listaGastos.insertAdjacentHTML("beforeend", totalHTML);

    // Adiciona eventos aos botões após renderizar
    document.querySelectorAll(".excluir-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        if (confirm("Tem certeza que deseja excluir este gasto?")) {
          gastos.splice(index, 1);
          localStorage.setItem("gastos", JSON.stringify(gastos));
          renderizarGastos(gastos);
        }
      });
    });

    document.querySelectorAll(".editar-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        const gasto = gastos[index];
        document.getElementById("ano").value = gasto.ano;
        document.getElementById("mes").value = gasto.mes;
        document.getElementById("categoria").value = gasto.categoria;
        document.getElementById("descricao").value = gasto.descricao;
        document.getElementById("valor").value = gasto.valor;
        editandoIndex = index;
      });
    });
  }

  renderizarGastos(gastos);
});
