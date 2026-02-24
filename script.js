document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("stands-layer");
    
    // Определяем touch-устройство ДО добавления обработчиков
    const isTouchDevice = ('ontouchstart' in window) || 
                         (navigator.maxTouchPoints > 0) || 
                         (navigator.msMaxTouchPoints > 0);

    standsData.stands.forEach(stand => {

        const div = document.createElement("div");
        div.classList.add("stand", stand.type, stand.position, stand.order);
        
        if (stand.description === "") {
            div.classList.add("free");
        }

        div.style.left = stand.x + "%";
        div.style.top = stand.y + "%";
        div.style.width = stand.w + "%";
        div.style.height = stand.h + "%";
        div.style.rotate = stand.r + "deg";

        div.textContent = stand.company;

        if (isTouchDevice) {
            // Для мобильных устройств и iPhone - только клик
            div.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                toggleCard(div, stand);
            });
        } else {
            // Для десктопа - только наведение
            div.addEventListener('mouseenter', () => {
                toggleCard(div, stand);
            });

            div.addEventListener('mouseleave', () => {
                removeCard();
            });
        }

        container.appendChild(div);
    });

    // Закрываем карточку при клике вне её на мобильных устройствах
    if (isTouchDevice) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.info-card') && !e.target.closest('.stand')) {
                removeCard();
            }
        });
    }
});

function toggleCard(target, stand) {
    const existing = document.querySelector(".info-card");
    if (existing) {
        existing.remove();
        return;
    }

    const card = document.createElement("div");
    card.className = "info-card";

    card.innerHTML = stand.description ? `
        <div class="card-title">${stand.company}</div>
        <div class="card-logo">
            <img src="${stand.logo}" alt="${stand.company}">
        </div>
        <div class="card-description">${stand.description}</div>
        <div class="card-info">${stand.info}</div>
    ` : `
        <div class="card-title">${stand.company}</div>
        <div class="card-free">СВОБОДНОЕ МЕСТО</div>
    `;

    document.body.appendChild(card);

    // Даем время браузеру отрендерить карточку перед расчетом позиции
    setTimeout(() => {
        const rect = target.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        
        const offset = 10;

        // Рассчитываем позицию
        let left = rect.right - 10 + scrollLeft + offset;
        let top = rect.top + 25 + scrollTop;

        // Проверяем, не выходит ли карточка за правый край экрана
        const cardRect = card.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        
        if (left + cardRect.width > viewportWidth + scrollLeft) {
            left = viewportWidth - cardRect.width - offset + scrollLeft;
        }

        // Проверяем, не выходит ли за нижний край
        const viewportHeight = window.innerHeight;
        if (top + cardRect.height > viewportHeight + scrollTop) {
            top = rect.top - cardRect.height - offset + scrollTop;
        }

        card.style.left = left + "px";
        card.style.top = top + "px";
        
        // Добавляем класс для анимации
        card.classList.add('visible');
    }, 10);
}

function removeCard() {
    const card = document.querySelector(".info-card");
    if (card) {
        card.remove();
    }
}