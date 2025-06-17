document.addEventListener('DOMContentLoaded', function() {
    // --- SELETORES DE ELEMENTOS ---
    const form = document.getElementById('form-entrada');
    const listaEntradas = document.getElementById('lista-entradas');
    const filtro = document.getElementById('filtro');
    const btnSalvar = form.querySelector('.btn-salvar'); // Seletor corrigido

    // --- ESTADO DA APLICAÇÃO ---
    let entradas = JSON.parse(localStorage.getItem('diarioViagem')) || [];
    let indiceEdicao = null; // Para controlar qual entrada está sendo editada

    // --- FUNÇÕES ---

    // Função para salvar no localStorage
    const salvarEntradas = () => {
        localStorage.setItem('diarioViagem', JSON.stringify(entradas));
    };

    // Formata data para 'dd de Mês de aaaa'
    const formatarData = (dataString) => {
        // Corrigindo problema de timezone ao criar a data
        const [ano, mes, dia] = dataString.split('-');
        const data = new Date(ano, mes - 1, dia);
        const options = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC' };
        return data.toLocaleDateString('pt-BR', options);
    };

    // Mapeia nome de país para código de 2 letras para a API de bandeiras
    const getCountryCode = (local) => {
        const paises = { 'brasil': 'br', 'estados unidos': 'us', 'frança': 'fr', 'japao': 'jp', 'itália': 'it', 'portugal': 'pt', 'espanha': 'es', 'argentina': 'ar' };
        const localLower = local.toLowerCase();
        for (const pais in paises) {
            if (localLower.includes(pais)) return paises[pais];
        }
        return 'xx'; // Código para bandeira genérica/desconhecida
    };

    // Exibe/Renderiza as entradas na tela
    const exibirEntradas = () => {
        const filtroValue = filtro.value;
        listaEntradas.innerHTML = '';

        if (entradas.length === 0) {
            listaEntradas.innerHTML = '<p class="empty-message">Nenhuma entrada ainda. Comece a escrever!</p>';
            return;
        }

        const entradasOrdenadas = [...entradas].sort((a, b) => new Date(b.data) - new Date(a.data));
        
        const entradasHTML = entradasOrdenadas.map((entrada, index) => {
            // Usa o índice original do array não ordenado para ter um ID estável
            const originalIndex = entradas.indexOf(entrada);

            return `
            <div class="entrada" data-index="${originalIndex}">
                <div class="entrada-header">
                    <span class="entrada-local">
                        <img src="https://flagcdn.com/w20/${getCountryCode(entrada.local)}.png" class="local-flag" alt="Bandeira">
                        ${entrada.local}
                    </span>
                    <span class="entrada-data">${formatarData(entrada.data)}</span>
                </div>
                <h4>${entrada.titulo}</h4>
                <div class="entrada-texto">${entrada.texto.replace(/\n/g, '<br>')}</div>
                <div class="entrada-acoes">
                    <button class="btn-acao btn-editar"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn-acao btn-excluir"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            </div>`;
        }).join('');

        listaEntradas.innerHTML = entradasHTML;
    };

    // --- EVENT LISTENERS ---

    // Adicionar ou Atualizar uma entrada
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const entradaData = {
            local: document.getElementById('local').value,
            data: document.getElementById('data').value,
            titulo: document.getElementById('titulo').value,
            texto: document.getElementById('texto').value,
            humor: document.getElementById('humor').value,
        };

        if (indiceEdicao !== null) {
            // Atualizando uma entrada existente
            entradas[indiceEdicao] = { ...entradas[indiceEdicao], ...entradaData };
            indiceEdicao = null; // Reseta o índice de edição
        } else {
            // Adicionando uma nova entrada
            entradaData.dataCriacao = new Date().toISOString();
            entradas.push(entradaData);
        }

        salvarEntradas();
        form.reset();
        document.getElementById('data').valueAsDate = new Date(); // Reseta data para hoje
        exibirEntradas();

        // Animação de confirmação
        btnSalvar.innerHTML = '<i class="fas fa-check"></i> Salvo!';
        setTimeout(() => {
            btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Entrada';
        }, 2000);
    });

    // Delegação de Eventos para os botões de editar e excluir
    listaEntradas.addEventListener('click', function(e) {
        const target = e.target;
        const btnEditar = target.closest('.btn-editar');
        const btnExcluir = target.closest('.btn-excluir');

        if (btnEditar) {
            const entradaDiv = btnEditar.closest('.entrada');
            const index = parseInt(entradaDiv.dataset.index, 10);
            const entrada = entradas[index];

            // Preenche o formulário para edição
            document.getElementById('local').value = entrada.local;
            document.getElementById('data').value = entrada.data;
            document.getElementById('titulo').value = entrada.titulo;
            document.getElementById('texto').value = entrada.texto;
            document.getElementById('humor').value = entrada.humor;

            indiceEdicao = index; // Armazena o índice da entrada que está sendo editada
            
            form.scrollIntoView({ behavior: 'smooth' }); // Rola a tela para o formulário
            btnSalvar.innerHTML = '<i class="fas fa-save"></i> Atualizar Entrada';
        }

        if (btnExcluir) {
            if (confirm('Tem certeza que deseja excluir esta entrada?')) {
                const entradaDiv = btnExcluir.closest('.entrada');
                const index = parseInt(entradaDiv.dataset.index, 10);
                
                entradas.splice(index, 1);
                salvarEntradas();
                exibirEntradas();
            }
        }
    });

    // Filtra entradas quando o select muda
    filtro.addEventListener('change', exibirEntradas);

    // --- INICIALIZAÇÃO ---
    document.getElementById('data').valueAsDate = new Date();
    exibirEntradas();
});