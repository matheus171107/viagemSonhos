document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const weatherInput = document.getElementById('weather-input');
    const searchBtn = document.getElementById('weather-btn');
    
    // Contêineres de estado da UI
    const weatherResultContainer = document.getElementById('weather-result');
    const weatherInitialMessage = document.getElementById('weather-initial-message');
    const weatherDataContainer = document.getElementById('weather-data');
    const weatherErrorContainer = document.getElementById('weather-error');

    // Elementos de dados
    const cityNameEl = document.getElementById('city-name');
    const weatherIconEl = document.getElementById('weather-icon');
    const temperatureEl = document.getElementById('temperature');
    const weatherDescriptionEl = document.getElementById('weather-description');
    const feelsLikeEl = document.getElementById('feels-like');
    const humidityEl = document.getElementById('humidity');
    const windSpeedEl = document.getElementById('wind-speed');

    // --- CONFIGURAÇÃO ---
    // REVISÃO DE SEGURANÇA: Esta é uma má prática em produção.
    // A chave de API nunca deve ser exposta no lado do cliente.
    const apiKey = 'b1a95d0366f076ed785f47c856c5a953';

    // --- FUNÇÕES ---

    // MELHORIA: Função para gerenciar o estado da UI (o que está visível)
    const setUIState = (state) => { // state pode ser 'initial', 'loading', 'data', 'error'
        weatherInitialMessage.style.display = state === 'initial' || state === 'loading' ? 'block' : 'none';
        weatherDataContainer.classList.toggle('hidden', state !== 'data');
        weatherErrorContainer.classList.toggle('hidden', state !== 'error');

        if (state === 'loading') {
            weatherInitialMessage.innerText = 'Carregando...';
        } else if (state === 'initial') {
            weatherInitialMessage.innerText = 'Digite o nome de uma cidade para ver a previsão do tempo.';
        }
    };

    // Função assíncrona para buscar os dados do tempo
    const getWeather = async (city) => {
        setUIState('loading');
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;

        try {
            const res = await fetch(apiURL);
            if (!res.ok) {
                // Lança um erro se a cidade não for encontrada (erro 404)
                throw new Error('Cidade não encontrada');
            }
            const data = await res.json();
            updateUI(data);
        } catch (error) {
            setUIState('error');
        }
    };

    // Função para atualizar a interface com os dados recebidos
    const updateUI = (data) => {
        cityNameEl.innerText = `${data.name}, ${data.sys.country}`;
        temperatureEl.innerText = `${Math.round(data.main.temp)}°C`;
        
        const description = data.weather[0].description;
        weatherDescriptionEl.innerText = description.charAt(0).toUpperCase() + description.slice(1);

        weatherIconEl.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
        
        feelsLikeEl.innerText = `${Math.round(data.main.feels_like)}°C`;
        humidityEl.innerText = `${data.main.humidity}%`;
        windSpeedEl.innerText = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        setUIState('data');
    };

    // MELHORIA: Centraliza a lógica de busca
    const handleSearch = () => {
        const city = weatherInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            // Opcional: Dar feedback se o campo estiver vazio
            alert("Por favor, digite o nome de uma cidade.");
        }
    };

    // --- EVENT LISTENERS ---
    searchBtn.addEventListener('click', handleSearch);
    weatherInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // --- INICIALIZAÇÃO ---
    // Define o estado inicial da UI ao carregar a página
    setUIState('initial');
});