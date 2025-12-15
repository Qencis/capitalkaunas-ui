// Laukiame duomenų iš Wix puslapio
window.addEventListener("message", (event) => {
    if (event.data.type === "offMarketData") {
        renderFeed(event.data.items);
    }
});

// Render funkcija
function renderFeed(items) {
    const feed = document.getElementById("feed");
    feed.innerHTML = "";

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${item.mainImage}" alt="">
            
            <div class="card-title">${item.title}</div>
            <div class="card-location">${item.city} · ${item.district}</div>
            <div class="card-price">${item.price.toLocaleString('lt-LT')} €</div>

            <div class="broker">
                <img src="${item.brokerAvatar || "/placeholder.jpg"}">
                <div>
                    <div>${item.brokerName}</div>
                    <div style="font-size:12px; opacity:0.6;">Klauskite dėl objekto</div>
                </div>
            </div>

            <div class="cta">KLAUSTI</div>
        `;

        feed.appendChild(card);
    });
}
