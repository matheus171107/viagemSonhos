document.addEventListener('DOMContentLoaded', () => {

    // --- SELETORES DE ELEMENTOS ---
    const btnNovaDica = document.getElementById('btn-nova-dica');
    const dicaPlaceholder = document.getElementById('dica-placeholder');
    const dicaResultado = document.getElementById('dica-resultado');
    const dicaIcone = document.getElementById('dica-icone');
    const dicaTexto = document.getElementById('dica-texto');
    const dicaTipo = document.getElementById('dica-tipo');

    // --- FUNÇÕES ---

    // Função assíncrona para buscar a dica da API
    const buscarDica = async () => {
        // Feedback visual para o usuário enquanto carrega
        btnNovaDica.disabled = true;
        btnNovaDica.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Buscando...';
        
        // ** MUDANÇA DE API **
        // Vamos buscar um post aleatório (de 1 a 100) da JSONPlaceholder
        const randomId = Math.floor(Math.random() * 100) + 1;
        const apiURL = `https://jsonplaceholder.typicode.com/posts/${randomId}`;

        try {
            const response = await fetch(apiURL);
            if (!response.ok) {
                // Se mesmo esta API falhar, nosso erro está pronto.
                throw new Error('Servidor da API indisponível.');
            }
            const data = await response.json();
            atualizarUI(data);

        } catch (error) {
            // O tratamento de erro continua o mesmo, agora para uma API mais confiável
            dicaTexto.textContent = "Oops! A fonte de dicas parece indisponível. Tente novamente mais tarde.";
            dicaIcone.className = 'fa-solid fa-cloud-bolt';
            dicaTipo.textContent = 'Erro de Conexão';
            
            dicaPlaceholder.classList.add('hidden');
            dicaResultado.classList.remove('hidden');
        } finally {
            // Reativa o botão, independentemente de sucesso ou falha
            btnNovaDica.disabled = false;
            btnNovaDica.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Me Dê uma Dica!';
        }
    };

    // Função para atualizar a interface com os dados recebidos
    const atualizarUI = (data) => {
        dicaPlaceholder.classList.add('hidden');
        dicaResultado.classList.remove('hidden');
        
        // ** MUDANÇA DE DADOS **
        // Usamos o 'title' do post como nossa dica e capitalizamos a primeira letra.
        const dica = data.title.charAt(0).toUpperCase() + data.title.slice(1);
        dicaTexto.textContent = dica;
        
        // Como esta API não tem 'tipo', vamos definir um genérico.
        dicaTipo.textContent = 'Inspiração';
        dicaIcone.className = 'fa-solid fa-lightbulb'; // Ícone padrão de ideia
    };

    // --- EVENT LISTENER ---
    btnNovaDica.addEventListener('click', buscarDica);
});