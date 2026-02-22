document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("stands-layer");

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

        div.addEventListener('mouseenter', () => {
            toggleCard(div, stand);
        });

        div.addEventListener('mouseleave', () => {
            removeCard();
        });

        container.appendChild(div);
    });
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

    const rect = target.getBoundingClientRect();

    const cardWidth = 260;
    const offset = 10;

    card.style.left = (rect.right - 10) + offset + "px";
    card.style.top = (rect.top + 25) + "px";

}


function removeCard() {
    const card = document.querySelector(".info-card");
    if (card) card.remove();
}