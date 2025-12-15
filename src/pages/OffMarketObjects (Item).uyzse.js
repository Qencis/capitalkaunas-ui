import wixLocation from 'wix-location';
import wixData from 'wix-data';

// BAZINAS URL – tavo site root
const BASE_URL = "https://testlama.wixstudio.com/ck2025";

/* Konvertuoja Wix Media URL (wix:image://...) į HTTPS */
function getImageUrl(mediaItem) {
    if (!mediaItem) return "";

    if (mediaItem.startsWith("wix:image://")) {
        let clean = mediaItem.replace("wix:image://", "");
        clean = clean.replace(/^v1\//, "");

        clean = clean.split("/")[0];
        clean = clean.split("#")[0];

        return `https://static.wixstatic.com/media/${clean}`;
    }

    return mediaItem;
}

/* Paima trumpą aprašymą (1–2 eilutės) */
function shorten(text, length = 180) {
    if (!text) return "";
    const clean = text.replace(/<[^>]+>/g, "").trim(); // remove HTML tags
    return clean.length > length ? clean.substring(0, length) + "..." : clean;
}

$w.onReady(() => {

    // Dinaminio puslapio duomenų rinkinys
    $w("#dynamicDataset").onReady(() => {
        const item = $w("#dynamicDataset").getCurrentItem();

        if (!item) {
            console.error("Nerastas objektas dinaminio puslapio duomenyse.");
            return;
        }

        // Konvertuojame galeriją
        let gallery = [];
        if (Array.isArray(item.gallery)) {
            gallery = item.gallery.map(img => getImageUrl(img));
        }

        // Pilnas CTA URL (rekomenduojamas)
        const fullCTAUrl = item["link-offmarketobjects-title"]
            ? `${BASE_URL}${item["link-offmarketobjects-title"]}`
            : wixLocation.url; // fallback

        // Paruošiame objektą iframe’ui
        const payload = {
            type: "offMarketObject",

            /* Pagrindiniai duomenys */
            title: item.title || "",
            city: item.city || "",
            district: item.district || "",

            area: item.area_m_2 || null,
            rooms: item.rooms || null,
            price: item.price || null,

            gallery: gallery,

            /* Aprašymas (trumpa versija) */
            descriptionShort: shorten(item.description, 180),

            /* Brokeris */
            brokerName: item.brokerName || "Capital brokeris",
            brokerAvatar: getImageUrl(item.brokerAvatar),

            /* CTA */
            ctaUrl: fullCTAUrl,
            ctaType: "page",

            /* Liko dienų */
            expirationDate: item.expirationDate || null
        };

        console.log("Landing page duomenys:", payload);

        // PostMessage → HTML iFrame
        $w("#offObjectHtml").postMessage(payload);
    });
});
