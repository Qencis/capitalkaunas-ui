import wixData from 'wix-data';

let currentIndex = 0; // Pradinis indeksas
let brokers = []; // Brokerių duomenų masyvas
let intervalId; // Kintamasis, skirtas intervalui
let isHovered = false; // Ar paveikslėlis užvestas?

$w.onReady(function () {
    // Užkrauname visus brokerius iš duomenų bazės
    wixData.query("Import3") // Pakeiskite "Import3" į savo kolekcijos pavadinimą
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                // Filtruojame tik brokerius, kurie turi nuotrauką
                brokers = results.items.filter(broker => broker.photo);

                // Brokerių masyvą išmaišome atsitiktine tvarka
                shuffleArray(brokers);

                if (brokers.length > 0) {
                    startImageRotation(); // Paleidžiame funkciją, jei yra tinkamų įrašų
                } else {
                    console.warn("Visi įrašai yra be nuotraukų!");
                }
            } else {
                console.error("Duomenų bazėje nėra įrašų!");
            }
        })
        .catch((err) => {
            console.error("Klaida gaunant duomenis:", err);
        });

    // Pridėkite pelės įvykių tvarkykles
    $w("#brokerImage").onMouseIn(() => {
        isHovered = true; // Nurodome, kad paveikslėlis užvestas
        stopImageRotation(); // Sustabdome automatinį keitimą
    });

    $w("#brokerImage").onMouseOut(() => {
        isHovered = false; // Nurodome, kad pelė nebeužvesta
        startImageRotation(); // Atnaujiname automatinį keitimą
    });
});

function startImageRotation() {
    if (!intervalId) { // Patikriname, ar intervalas jau nepradėtas
        intervalId = setInterval(() => {
            if (!isHovered) { // Tikriname, ar pelė nėra užvesta
                currentIndex = (currentIndex + 1) % brokers.length; // Sukamės per masyvą
                updateImage();
            }
        }, 3000);
    }
}

function stopImageRotation() {
    clearInterval(intervalId); // Sustabdome intervalą
    intervalId = null; // Nustatome, kad intervalo nėra
}

function updateImage() {
    const currentBroker = brokers[currentIndex]; // Dabartinis brokeris
    if (currentBroker.photo) {
        // Fade-out animacija
        $w("#imageContainer")
            .hide("fade", { duration: 500 }) // Sklandžiai išnyksta konteineris
            .then(() => {
                // Prieš fade-in pakeičiame paveikslėlį, tekstą ir laukiam 300ms
                $w("#brokerImage").src = currentBroker.photo; // Nustatome naują paveikslėlį
                $w("#brokerName").text = currentBroker.name || "Nenurodytas vardas"; // Pakeičiame vardą

                if (currentBroker.url) {
                    $w("#brokerImage").link = currentBroker.url; // Pridedame nuorodą
                } else {
                    $w("#brokerImage").link = null; // Pašaliname nuorodą, jei nėra
                }

                // Pridėtas uždelsimas (300ms) prieš fade-in
                setTimeout(() => {
                    $w("#imageContainer").show("fade", { duration: 500 }); // Sklandžiai atsiranda konteineris
                }, 300); // Uždelstas atsiradimas
            });
    } else {
        console.warn(`Brokeris be nuotraukos: ${currentBroker.title}`);
    }
}

// Funkcija atsitiktinai išmaišo masyvą
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Pasirenkame atsitiktinį indeksą
        [array[i], array[j]] = [array[j], array[i]]; // Keičiamės vietomis
    }
}
