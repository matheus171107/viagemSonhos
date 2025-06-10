document.addEventListener('DOMContentLoaded', function() {
    const valorInput = document.getElementById('valor');
    const moedaOrigem = document.getElementById('moeda-origem');
    const moedaDestino = document.getElementById('moeda-destino');
    const swapBtn = document.getElementById('swap-btn');
    const btnConverter = document.getElementById('btn-converter');
    const resultadoDiv = document.getElementById('resultado');
    const taxaInfo = document.getElementById('taxa-info');
    const dataAtualizacao = document.getElementById('data-atualizacao');
    
    // Simulação de taxas de câmbio (em uma aplicação real, você buscaria isso de uma API)
    const taxas = {
        USD: { BRL: 5.20, EUR: 0.85, GBP: 0.75, JPY: 110.00, USD: 1 },
        BRL: { USD: 0.19, EUR: 0.16, GBP: 0.14, JPY: 21.15, BRL: 1 },
        EUR: { USD: 1.18, BRL: 6.12, GBP: 0.88, JPY: 129.50, EUR: 1 },
        GBP: { USD: 1.33, BRL: 6.93, EUR: 1.14, JPY: 147.25, GBP: 1 },
        JPY: { USD: 0.0091, BRL: 0.047, EUR: 0.0077, GBP: 0.0068, JPY: 1 }
    };
    
    // Atualiza a data de "atualização"
    const agora = new Date();
    dataAtualizacao.textContent = agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR').slice(0,5);
    
    // Adiciona bandeiras aos selects (usando uma biblioteca ou implementação mais robusta em produção)
    function atualizarBandeiras() {
        document.querySelectorAll('select').forEach(select => {
            select.style.backgroundImage = `url('${select.options[select.selectedIndex].getAttribute('data-flag')}')`;
            select.style.backgroundRepeat = 'no-repeat';
            select.style.backgroundPosition = '10px center';
            select.style.paddingLeft = '40px';
        });
    }
    
    atualizarBandeiras();
    
    // Troca moedas de origem e destino
    swapBtn.addEventListener('click', function() {
        const temp = moedaOrigem.value;
        moedaOrigem.value = moedaDestino.value;
        moedaDestino.value = temp;
        atualizarBandeiras();
    });
    
    // Conversão de moeda
    btnConverter.addEventListener('click', function() {
        const valor = parseFloat(valorInput.value);
        if (isNaN(valor) || valor <= 0) {
            alert('Por favor, insira um valor válido maior que zero');
            return;
        }
        
        const origem = moedaOrigem.value;
        const destino = moedaDestino.value;
        
        if (origem === destino) {
            resultadoDiv.textContent = `O valor permanece o mesmo: ${valor.toFixed(2)} ${origem}`;
        } else {
            const taxa = taxas[origem][destino];
            const valorConvertido = valor * taxa;
            
            resultadoDiv.textContent = `${valor.toFixed(2)} ${origem} = ${valorConvertido.toFixed(2)} ${destino}`;
            taxaInfo.innerHTML = `Taxa de câmbio: 1 ${origem} = ${taxa.toFixed(4)} ${destino}`;
        }
        
        resultadoDiv.classList.add('mostrar');
    });
    
    // Atualiza bandeiras quando moedas são alteradas
    moedaOrigem.addEventListener('change', atualizarBandeiras);
    moedaDestino.addEventListener('change', atualizarBandeiras);
    
    // Converter ao pressionar Enter
    valorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            btnConverter.click();
        }
    });
});