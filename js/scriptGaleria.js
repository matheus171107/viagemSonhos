document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS DA GALERIA ---
    const inputFoto = document.getElementById('input-foto');
    const galeriaContainer = document.getElementById('galeria-container');
    const btnLimparGaleria = document.getElementById('btn-limpar-galeria');
    
    // --- SELETORES DE ELEMENTOS DO LIGHTBOX (NOVO) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnFecharLightbox = document.querySelector('.lightbox-btn-fechar');
    const btnAnterior = document.querySelector('.lightbox-btn-anterior');
    const btnProximo = document.querySelector('.lightbox-btn-proximo');
    
    const STORAGE_KEY = 'galeriaFotosViagem';
    let fotos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    let indiceFotoAtual = 0; // Controla qual foto está aberta no Lightbox

    // --- FUNÇÕES DA GALERIA ---

    const salvarFotos = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fotos));
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                alert('Erro: Armazenamento cheio. Não é possível salvar mais fotos.');
            }
        }
    };

    const renderizarGaleria = () => {
        galeriaContainer.innerHTML = '';
        if (fotos.length === 0) {
            galeriaContainer.innerHTML = '<p class="empty-message">Sua galeria está vazia. Adicione sua primeira foto!</p>';
            return;
        }

        fotos.forEach((fotoData, index) => {
            const fotoWrapper = document.createElement('div');
            fotoWrapper.className = 'foto-wrapper';

            const img = document.createElement('img');
            img.src = fotoData;
            img.dataset.index = index; // **NOVO**: Adiciona o índice para saber qual foto abrir
            
            // **NOVO**: Evento de clique para abrir o Lightbox
            img.addEventListener('click', () => abrirLightbox(index));
            
            const btnRemoverFoto = document.createElement('button');
            btnRemoverFoto.className = 'btn-remover-foto';
            btnRemoverFoto.innerHTML = '×';
            btnRemoverFoto.title = 'Remover esta foto';
            
            btnRemoverFoto.addEventListener('click', (e) => {
                e.stopPropagation(); // **NOVO**: Impede que o clique no botão abra o lightbox
                if (confirm('Tem certeza que deseja remover esta foto?')) {
                    fotos.splice(index, 1);
                    salvarFotos();
                    renderizarGaleria();
                }
            });

            fotoWrapper.appendChild(img);
            fotoWrapper.appendChild(btnRemoverFoto);
            galeriaContainer.appendChild(fotoWrapper);
        });
    };

    const handleNovaFoto = (event) => {
        const arquivo = event.target.files[0];
        if (!arquivo) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            fotos.push(e.target.result);
            salvarFotos();
            renderizarGaleria();
        };
        reader.onerror = () => alert('Ocorreu um erro ao ler a imagem.');
        reader.readAsDataURL(arquivo);
        inputFoto.value = ''; 
    };
    
    // --- FUNÇÕES DO LIGHTBOX (NOVO) ---
    
    const abrirLightbox = (index) => {
        if (index < 0 || index >= fotos.length) return; // Checagem de segurança
        indiceFotoAtual = index;
        lightboxImg.src = fotos[indiceFotoAtual];
        lightbox.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Impede o scroll da página ao fundo
    };

    const fecharLightbox = () => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Reabilita o scroll da página
    };

    const mostrarFotoAnterior = () => {
        // O cálculo com módulo (%) garante que a navegação seja circular
        const novoIndice = (indiceFotoAtual - 1 + fotos.length) % fotos.length;
        abrirLightbox(novoIndice);
    };

    const mostrarFotoProxima = () => {
        const novoIndice = (indiceFotoAtual + 1) % fotos.length;
        abrirLightbox(novoIndice);
    };
    
    // --- EVENT LISTENERS ---

    inputFoto.addEventListener('change', handleNovaFoto);
    
    btnLimparGaleria.addEventListener('click', () => {
        if (fotos.length > 0 && confirm('Atenção: Isso removerá TODAS as fotos da galeria. Deseja continuar?')) {
            fotos = [];
            salvarFotos();
            renderizarGaleria();
        }
    });

    // **NOVO**: Event Listeners do Lightbox
    btnFecharLightbox.addEventListener('click', fecharLightbox);
    btnAnterior.addEventListener('click', mostrarFotoAnterior);
    btnProximo.addEventListener('click', mostrarFotoProxima);

    // Fecha o lightbox se o usuário clicar no fundo escuro
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            fecharLightbox();
        }
    });

    // Navegação pelo teclado (setas e Esc)
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('hidden')) return; // Só funciona se o lightbox estiver aberto
        
        if (e.key === 'ArrowLeft') mostrarFotoAnterior();
        if (e.key === 'ArrowRight') mostrarFotoProxima();
        if (e.key === 'Escape') fecharLightbox();
    });

    // --- INICIALIZAÇÃO ---
    renderizarGaleria();
});