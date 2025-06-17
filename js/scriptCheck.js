document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS (agrupados no topo) ---
    const checklistInput = document.getElementById("checklistItemInput");
    const addChecklistBtn = document.getElementById("addChecklistItemBtn");
    const checklistUL = document.getElementById("checklistUL");
    const clearChecklistBtn = document.getElementById("clearChecklistBtn");

    // Chave para salvar no localStorage
    const STORAGE_KEY = 'checklistData';

    // Carrega os itens do localStorage ou inicia um array vazio
    let checklistItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // --- FUNÇÕES ---

    // Função para SALVAR o estado atual no localStorage
    const saveItems = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistItems));
    };

    // Função para RENDERIZAR (desenhar) a lista na tela
    const renderChecklist = () => {
        checklistUL.innerHTML = '';

        if (checklistItems.length === 0) {
            // Adiciona uma mensagem amigável quando a lista está vazia
            checklistUL.innerHTML = '<li class="empty-message">Sua checklist está vazia. Adicione um item!</li>';
            return;
        }

        checklistItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.classList.toggle('completed', item.completed); // Aplica classe se concluído

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item.completed;
            
            // Otimização: atualiza apenas o item clicado, sem redesenhar a lista toda
            checkbox.addEventListener('change', () => {
                checklistItems[index].completed = checkbox.checked;
                saveItems();
                li.classList.toggle('completed', checkbox.checked);
            });

            const textSpan = document.createElement('span');
            textSpan.className = 'item-text';
            textSpan.textContent = item.text;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-btn';
            removeBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>'; // Usando ícone
            removeBtn.title = 'Remover item'; // Acessibilidade
            
            removeBtn.addEventListener('click', () => {
                checklistItems.splice(index, 1);
                saveItems();
                renderChecklist(); // Precisa redesenhar para remover o elemento do DOM
            });

            li.appendChild(checkbox);
            li.appendChild(textSpan);
            li.appendChild(removeBtn);
            checklistUL.appendChild(li);
        });
    };
    
    // Lógica de adição extraída para uma função
    const handleAddItem = () => {
        const text = checklistInput.value.trim();
        if (text !== '') {
            checklistItems.push({ text: text, completed: false });
            checklistInput.value = '';
            saveItems();
            renderChecklist();
            checklistInput.focus(); // UX: foca no input novamente
        }
    };
    
    // --- EVENT LISTENERS ---

    addChecklistBtn.addEventListener('click', handleAddItem);

    checklistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleAddItem();
        }
    });

    clearChecklistBtn.addEventListener('click', () => {
        // Só mostra o 'confirm' se a lista não estiver vazia
        if (checklistItems.length > 0 && confirm("Você tem certeza que deseja limpar toda a checklist?")) {
            checklistItems = [];
            saveItems();
            renderChecklist();
        }
    });
    
    // Carregamento inicial da lista
    renderChecklist();
});