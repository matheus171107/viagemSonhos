        // Função para adicionar e remover tarefas da lista
        let novaTarefaInput = document.getElementById("novaTarefa");
        let adicionarTarefaBotao = document.getElementById("adicionarTarefa");
        let listaTarefasUl = document.getElementById("listaTarefas");

        adicionarTarefaBotao.addEventListener("click", function () {
            let tarefaTexto = novaTarefaInput.value;

            if (tarefaTexto.trim() !== "") { // Evita adicionar tarefas vazias
                let novaTarefaLi = document.createElement("li");
                novaTarefaLi.textContent = tarefaTexto;
                // Adiciona botão de remover
                let removerBotao = document.createElement("button");
                removerBotao.textContent = "Remover";
                removerBotao.addEventListener("click", function () {
                    listaTarefasUl.removeChild(novaTarefaLi);
                });

                novaTarefaLi.appendChild(removerBotao);
                listaTarefasUl.appendChild(novaTarefaLi);
                novaTarefaInput.value = ""; // Limpa o input
            }
        });

        // <!-- BOTÃO PARA LIMPAR A LISTA -->
        let limparListaBotao = document.getElementById("limparLista");
        limparListaBotao.addEventListener("click", function () {
            listaTarefasUl.innerHTML = ""; // Limpa a lista de tarefas
        });