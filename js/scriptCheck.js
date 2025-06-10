        // Seleciona os elementos do DOM
        const checklistInput = document.getElementById("checklistItemInput");
        const addChecklistBtn = document.getElementById("addChecklistItemBtn");
        const checklistUL = document.getElementById("checklistUL");

        // Chave para salvar no localStorage (evita conflitos)
        const STORAGE_KEY = 'checklistData';

        // Carrega os itens do localStorage ou inicia um array vazio
        // JSON.parse() converte a string de volta para um array de objetos
        let checklistItems = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        // Função para SALVAR o estado atual no localStorage
        // JSON.stringify() converte o array de objetos em uma string para armazenamento
        const saveItems = () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistItems));
        };

        // Função para RENDERIZAR (desenhar) a lista na tela
        const renderChecklist = () => {
            // 1. Limpa a lista atual para não duplicar itens
            checklistUL.innerHTML = '';

            // 2. Itera sobre cada item no array `checklistItems`
            checklistItems.forEach((item, index) => {
                // Cria os elementos HTML para cada item
                const li = document.createElement('li');
                if (item.completed) {
                    li.classList.add('completed'); // Adiciona a classe se estiver concluído
                }

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                // RF07.2: Marcar/desmarcar item
                checkbox.addEventListener('change', () => {
                    checklistItems[index].completed = !checklistItems[index].completed;
                    saveItems(); // Salva a mudança
                    renderChecklist(); // Redesenha a lista para aplicar o estilo
                });

                const textSpan = document.createElement('span');
                textSpan.className = 'item-text';
                textSpan.textContent = item.text;

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-btn';
                removeBtn.textContent = 'Remover';
                // RF07.3: Remover item
                removeBtn.addEventListener('click', () => {
                    checklistItems.splice(index, 1); // Remove o item do array pelo seu índice
                    saveItems(); // Salva a mudança
                    renderChecklist(); // Redesenha a lista
                });

                // Monta o item da lista (LI)
                li.appendChild(checkbox);
                li.appendChild(textSpan);
                li.appendChild(removeBtn);

                // Adiciona o LI completo à lista UL
                checklistUL.appendChild(li);
            });
        };

        // RF07.1: Adicionar novo item
        addChecklistBtn.addEventListener('click', () => {
            const text = checklistInput.value.trim();
            if (text !== '') {
                // Adiciona o novo item como um objeto ao nosso array
                checklistItems.push({ text: text, completed: false });
                checklistInput.value = ''; // Limpa o input
                saveItems(); // Salva o novo estado
                renderChecklist(); // Redesenha a lista com o novo item
            }
        });

        // Permite adicionar com a tecla "Enter"
        checklistInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addChecklistBtn.click();
            }
        });


        // RF07.4: Carregamento inicial da lista
        // Chama a função de renderização assim que a página carrega
        // para mostrar os itens que foram salvos anteriormente.
        document.addEventListener('DOMContentLoaded', renderChecklist);

        // RF07.5: Limpar lista
        const clearChecklistBtn = document.getElementById("clearChecklistBtn");
        clearChecklistBtn.addEventListener('click', () => {
            if (confirm("Você tem certeza que deseja limpar a lista?")) {
                checklistItems = []; // Limpa o array
                saveItems(); // Salva o estado vazio
                renderChecklist(); // Redesenha a lista vazia
            }
        });
        