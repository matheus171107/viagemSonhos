document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-entrada');
    const listaEntradas = document.getElementById('lista-entradas');
    const filtro = document.getElementById('filtro');
    
    // Carrega entradas do localStorage
    let entradas = JSON.parse(localStorage.getItem('diarioViagem')) || [];
    
    // Exibe entradas
    function exibirEntradas(filtroValue = 'todos') {
        if (entradas.length === 0) {
            listaEntradas.innerHTML = `
                <div class="nenhuma-entrada">
                    <i class="fas fa-book" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>Nenhuma entrada ainda. Comece a escrever suas aventuras!</p>
                </div>
            `;
            return;
        }
        
        let entradasFiltradas = [...entradas];
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        
        if (filtroValue === 'hoje') {
            entradasFiltradas = entradas.filter(entrada => {
                const entradaDate = new Date(entrada.data);
                return entradaDate.toDateString() === hoje.toDateString();
            });
        } else if (filtroValue === 'semana') {
            const semanaPassada = new Date(hoje);
            semanaPassada.setDate(hoje.getDate() - 7);
            
            entradasFiltradas = entradas.filter(entrada => {
                const entradaDate = new Date(entrada.data);
                return entradaDate >= semanaPassada;
            });
        } else if (filtroValue === 'mes') {
            const mesPassado = new Date(hoje);
            mesPassado.setMonth(hoje.getMonth() - 1);
            
            entradasFiltradas = entradas.filter(entrada => {
                const entradaDate = new Date(entrada.data);
                return entradaDate >= mesPassado;
            });
        }
        
        // Ordena do mais recente para o mais antigo
        entradasFiltradas.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        if (entradasFiltradas.length === 0) {
            listaEntradas.innerHTML = `
                <div class="nenhuma-entrada">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.3;"></i>
                    <p>Nenhuma entrada encontrada com este filtro.</p>
                </div>
            `;
            return;
        }
        
        listaEntradas.innerHTML = entradasFiltradas.map((entrada, index) => `
            <div class="entrada" data-id="${index}">
                <div class="entrada-header">
                    <span class="entrada-local">
                        <img src="https://flagcdn.com/w20/${getCountryCode(entrada.local)}.png" class="local-flag" alt="${entrada.local}">
                        ${entrada.local}
                    </span>
                    <span class="entrada-data">${formatarData(entrada.data)}</span>
                </div>
                <h4>${entrada.titulo}</h4>
                <div class="entrada-texto">${entrada.texto.replace(/\n/g, '<br>')}</div>
                <div class="entrada-acoes">
                    <button class="btn-acao btn-editar" onclick="editarEntrada(${index})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-acao btn-excluir" onclick="excluirEntrada(${index})">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Formata data para exibição
    function formatarData(dataString) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    }
    
    // Simulação de código de país (em app real, usar geolocalização ou seleção)
    function getCountryCode(local) {
        const paises = {
            'Brasil': 'br',
            'Estados Unidos': 'us',
            'França': 'fr',
            'Japão': 'jp',
            'Itália': 'it',
            'Portugal': 'pt',
            'Espanha': 'es',
            'Argentina': 'ar'
        };
        
        for (const pais in paises) {
            if (local.includes(pais)) {
                return paises[pais];
            }
        }
        
        return 'gl'; // Bandeira genérica
    }
    
    // Adiciona nova entrada
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novaEntrada = {
            local: document.getElementById('local').value,
            data: document.getElementById('data').value,
            titulo: document.getElementById('titulo').value,
            texto: document.getElementById('texto').value,
            humor: document.getElementById('humor').value,
            dataCriacao: new Date().toISOString()
        };
        
        entradas.push(novaEntrada);
        localStorage.setItem('diarioViagem', JSON.stringify(entradas));
        
        form.reset();
        exibirEntradas(filtro.value);
        
        // Animação de confirmação
        const btnSalvar = document.querySelector('.btn-salvar');
        btnSalvar.innerHTML = '<i class="fas fa-check"></i> Salvo!';
        setTimeout(() => {
            btnSalvar.innerHTML = '<i class="fas fa-save"></i> Salvar Entrada';
        }, 2000);
    });
    
    // Filtra entradas
    filtro.addEventListener('change', function() {
        exibirEntradas(this.value);
    });
    
    // Funções globais para editar/excluir
    window.editarEntrada = function(index) {
        const entrada = entradas[index];
        document.getElementById('local').value = entrada.local;
        document.getElementById('data').value = entrada.data;
        document.getElementById('titulo').value = entrada.titulo;
        document.getElementById('texto').value = entrada.texto;
        document.getElementById('humor').value = entrada.humor;
        
        // Remove a entrada antiga
        entradas.splice(index, 1);
        localStorage.setItem('diarioViagem', JSON.stringify(entradas));
        exibirEntradas(filtro.value);
        
        // Rolagem suave para o formulário
        document.getElementById('form-entrada').scrollIntoView({ behavior: 'smooth' });
    };
    
    window.excluirEntrada = function(index) {
        if (confirm('Tem certeza que deseja excluir esta entrada?')) {
            entradas.splice(index, 1);
            localStorage.setItem('diarioViagem', JSON.stringify(entradas));
            exibirEntradas(filtro.value);
        }
    };
    
    // Define data padrão como hoje
    document.getElementById('data').valueAsDate = new Date();
    
    // Exibe entradas ao carregar
    exibirEntradas();
});