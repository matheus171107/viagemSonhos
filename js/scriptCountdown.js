document.addEventListener('DOMContentLoaded', () => {
    // --- SELETORES DE ELEMENTOS ---
    const dateInput = document.getElementById('date-input');
    const addTripBtn = document.getElementById('add-trip-btn');
    const countdownContainer = document.getElementById('countdown-container');

    // --- ESTADO E PERSISTÊNCIA ---
    const STORAGE_KEY = 'countdownData';
    let activeCountdowns = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    const saveCountdowns = () => {
        const dataToSave = activeCountdowns.map(({ id, targetDate, paused }) => ({ id, targetDate, paused }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    };

    // --- FUNÇÕES ---
    const formatTime = (time) => (time < 10 ? `0${time}` : time);

    const updateCountdownDisplay = (card, time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);

        card.querySelector('.days').textContent = formatTime(days);
        card.querySelector('.hours').textContent = formatTime(hours);
        card.querySelector('.minutes').textContent = formatTime(minutes);
        card.querySelector('.seconds').textContent = formatTime(seconds);
    };

    const startCountdown = (countdownData) => {
        const card = document.querySelector(`[data-id='${countdownData.id}']`);
        if (!card) return;

        countdownData.intervalId = setInterval(() => {
            if (countdownData.paused) return;

            const now = new Date().getTime();
            const distance = countdownData.targetDate - now;

            if (distance < 0) {
                clearInterval(countdownData.intervalId);
                card.querySelector('.timer').innerHTML = "<h4>🎉 Boa Viagem! 🎉</h4>";
                card.querySelectorAll('.controls button:not(.delete-btn)').forEach(btn => btn.disabled = true);
                return;
            }
            updateCountdownDisplay(card, distance);
        }, 1000);
    };
    
    const renderCountdown = (countdownData) => {
        const cardHTML = `
            <div class="countdown-card" data-id="${countdownData.id}">
                <div class="timer">
                    <div><span class="days">00</span>D</div>
                    <div><span class="hours">00</span>H</div>
                    <div><span class="minutes">00</span>M</div>
                    <div><span class="seconds">00</span>S</div>
                </div>
                <div class="controls">
                    <button class="pause-btn">${countdownData.paused ? 'Retomar' : 'Pausar'}</button>
                    <button class="restart-btn">Recomeçar</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            </div>`;
        countdownContainer.insertAdjacentHTML('beforeend', cardHTML);
        startCountdown(countdownData);
    };

    const addTrip = () => {
        const dateValue = dateInput.value;

        if (!dateValue) {
            alert('Por favor, preencha o destino e a data da viagem.');
            return;
        }

        const targetDate = new Date(dateValue).getTime();
        if (isNaN(targetDate) || targetDate < new Date().getTime()) {
            alert('Por favor, insira uma data e hora futuras.');
            return;
        }

        const newCountdown = {
            id: `trip-${Date.now()}`,
            targetDate,
            paused: false,
            intervalId: null
        };

        activeCountdowns.push(newCountdown);
        saveCountdowns();
        renderCountdown(newCountdown);

        dateInput.value = '';
    };

    const handleControlClick = (e) => {
        const target = e.target;
        if (!target.matches('.pause-btn, .restart-btn, .delete-btn')) return;

        const card = target.closest('.countdown-card');
        const id = card.dataset.id;
        const countdownData = activeCountdowns.find(c => c.id === id);
        if (!countdownData) return;

        if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir este contador?')) {
                clearInterval(countdownData.intervalId);
                card.remove();
                activeCountdowns = activeCountdowns.filter(c => c.id !== id);
                saveCountdowns();
            }
        } else if (target.classList.contains('pause-btn')) {
            countdownData.paused = !countdownData.paused;
            target.textContent = countdownData.paused ? 'Retomar' : 'Pausar';
            saveCountdowns();
        } else if (target.classList.contains('restart-btn')) {
            clearInterval(countdownData.intervalId);
            countdownData.paused = false;
            card.querySelector('.pause-btn').textContent = 'Pausar';
            startCountdown(countdownData);
            saveCountdowns();
        }
    };
    
    // --- INICIALIZAÇÃO ---
    const loadCountdowns = () => {
        if (activeCountdowns.length > 0) {
            activeCountdowns.forEach(renderCountdown);
        }
    };

    addTripBtn.addEventListener('click', addTrip);
    countdownContainer.addEventListener('click', handleControlClick);

    loadCountdowns();
});