document.addEventListener('DOMContentLoaded', function() {
    // --- SELETORES DE ELEMENTOS ---
    const valorInput = document.getElementById('valor');
    const moedaOrigem = document.getElementById('moeda-origem');
    const moedaDestino = document.getElementById('moeda-destino');
    const swapBtn = document.getElementById('swap-btn');
    const btnConverter = document.getElementById('btn-converter');
    const resultadoDiv = document.getElementById('resultado');
    const taxaInfo = document.getElementById('taxa-info'); // Agora encontra o elemento no HTML
    const dataAtualizacaoP = document.querySelector('.data-atualizacao'); // Seletor corrigido para classe

    // --- DADOS E CONFIGURAÇÕES ---

    const taxas = {
        USD: { BRL: 5.20, EUR: 0.92, GBP: 0.79, JPY: 157.30, USD: 1 },
        BRL: { USD: 0.19, EUR: 0.18, GBP: 0.15, JPY: 30.25, BRL: 1 },
        EUR: { USD: 1.08, BRL: 5.63, GBP: 0.86, JPY: 170.50, EUR: 1 },
        GBP: { USD: 1.27, BRL: 6.58, EUR: 1.17, JPY: 199.11, GBP: 1 },
        JPY: { USD: 0.0064, BRL: 0.033, EUR: 0.0059, GBP: 0.0050, JPY: 1 }
    };
    
    const bandeiras = {
        USD: '🇺🇸', BRL: '🇧🇷', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵'
    };

    // --- FUNÇÕES ---

    // Popula os selects com as moedas disponíveis
    function popularSelects() {
        const moedasDisponiveis = Object.keys(taxas);
        moedasDisponiveis.forEach(moeda => {
            const textoOpcao = `${bandeiras[moeda] || '🏳️'} ${moeda}`;
            moedaOrigem.add(new Option(textoOpcao, moeda));
            moedaDestino.add(new Option(textoOpcao, moeda));
        });
        // Define valores iniciais padrão
        moedaOrigem.value = 'BRL';
        moedaDestino.value = 'USD';
    }

    // Lógica principal de conversão
    function handleConvert() {
        const valor = parseFloat(valorInput.value);
        const origem = moedaOrigem.value;
        const destino = moedaDestino.value;

        if (isNaN(valor) || valor <= 0) {
            resultadoDiv.textContent = 'Por favor, insira um valor válido.';
            resultadoDiv.classList.add('mostrar', 'erro');
            taxaInfo.textContent = '';
            return;
        }
        
        resultadoDiv.classList.remove('erro');

        if (origem === destino) {
            resultadoDiv.textContent = `${valor.toFixed(2)} ${origem}`;
            taxaInfo.textContent = `As moedas de origem e destino são iguais.`;
        } else {
            const taxa = taxas[origem][destino];
            const valorConvertido = valor * taxa;
            
            // Usa a API Intl para formatar os valores como moeda (mais profissional)
            const formatoOrigem = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: origem });
            const formatoDestino = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: destino });

            resultadoDiv.innerHTML = `<strong>${formatoOrigem.format(valor)} = ${formatoDestino.format(valorConvertido)}</strong>`;
            taxaInfo.textContent = `Taxa: 1 ${origem} = ${taxa.toFixed(4)} ${destino}`;
        }
        
        resultadoDiv.classList.add('mostrar');
    }

    // --- INICIALIZAÇÃO E EVENT LISTENERS ---

    popularSelects();

    dataAtualizacaoP.textContent = `Taxas simuladas de ${new Date().toLocaleDateString('pt-BR')}`;

    btnConverter.addEventListener('click', handleConvert);

    swapBtn.addEventListener('click', () => {
        const temp = moedaOrigem.value;
        moedaOrigem.value = moedaDestino.value;
        moedaDestino.value = temp;
        if (valorInput.value) handleConvert(); // Converte de novo após a troca
    });

    valorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleConvert();
    });
    
    // Reconverte ao mudar as moedas para feedback imediato
    moedaOrigem.addEventListener('change', handleConvert);
    moedaDestino.addEventListener('change', handleConvert);
});