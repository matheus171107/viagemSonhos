document.addEventListener('DOMContentLoaded', () => {

    // 1. SELETORES DE ELEMENTOS (usando 'const')
    const novaTarefaInput = document.getElementById("novaTarefa");
    const adicionarTarefaBotao = document.getElementById("adicionarTarefa");
    const listaTarefasUl = document.getElementById("listaTarefas");
    const limparListaBotao = document.getElementById("limparLista");

    // 2. PERSISTÊNCIA: Chave e carregamento do localStorage
    const STORAGE_KEY = 'listaDestinosData';
    let destinos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // --- FUNÇÕES ---

    // Função para salvar os destinos no localStorage
    const saveDestinos = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(destinos));
    };

    // Função para renderizar/exibir a lista na tela
    const renderDestinos = () => {
        listaTarefasUl.innerHTML = ''; // Limpa a lista antes de redesenhar

        if (destinos.length === 0) {
            listaTarefasUl.innerHTML = '<li class="empty-message">Sua lista de destinos está vazia.</li>';
            return;
        }

        destinos.forEach((destino, index) => {
            const li = document.createElement('li');
            
            const span = document.createElement('span');
            span.textContent = destino;
            
            const removerBotao = document.createElement('button');
            removerBotao.className = 'remove-btn';
            removerBotao.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Usando ícone
            removerBotao.title = 'Remover destino';
            
            // Adiciona um atributo para sabermos qual item remover
            removerBotao.dataset.index = index;

            li.appendChild(span);
            li.appendChild(removerBotao);
            listaTarefasUl.appendChild(li);
        });
    };
    
    // Função para adicionar um novo destino
    const handleAddDestino = () => {
        const textoDestino = novaTarefaInput.value.trim();

        if (textoDestino !== "") {
            destinos.push(textoDestino); // Adiciona ao array
            saveDestinos(); // Salva
            renderDestinos(); // Redesenha a lista
            novaTarefaInput.value = ""; // Limpa o input
            novaTarefaInput.focus(); // Foca no input para adicionar mais
        }
    };

    // --- EVENT LISTENERS ---

    // Adicionar com clique no botão
    adicionarTarefaBotao.addEventListener("click", handleAddDestino);

    // 3. UX: Adicionar com a tecla "Enter"
    novaTarefaInput.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') {
            handleAddDestino();
        }
    });

    // 5. OTIMIZAÇÃO: Delegação de eventos para remoção
    listaTarefasUl.addEventListener('click', (e) => {
        // Verifica se o elemento clicado (ou seu pai) é um botão de remover
        const removeBtn = e.target.closest('.remove-btn');
        if (removeBtn) {
            const index = parseInt(removeBtn.dataset.index, 10);
            destinos.splice(index, 1); // Remove do array
            saveDestinos(); // Salva
            renderDestinos(); // Redesenha
        }
    });

    // 4. UX: Confirmação para limpar a lista
    limparListaBotao.addEventListener("click", () => {
        if (destinos.length > 0 && confirm("Tem certeza que deseja limpar todos os destinos da lista?")) {
            destinos = []; // Limpa o array
            saveDestinos(); // Salva o estado vazio
            renderDestinos(); // Redesenha a lista vazia
        }
    });

    // --- INICIALIZAÇÃO ---
    renderDestinos(); // Chama a função para exibir a lista ao carregar a página
});