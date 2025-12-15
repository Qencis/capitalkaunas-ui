import wixData from 'wix-data';

const BASE_URL = "https://www.capitalkaunas.lt";

function getImageUrl(mediaItem) {
    if (!mediaItem) return "";

    if (typeof mediaItem === "object" && mediaItem.src) {
        mediaItem = mediaItem.src;
    }
    if (typeof mediaItem === "string" && mediaItem.startsWith("https")) {
        return mediaItem;
    }
    if (typeof mediaItem === "string" && mediaItem.startsWith("wix:image://")) {
        let clean = mediaItem.replace("wix:image://", "");
        clean = clean.replace(/^v1\//, "");
        clean = clean.split("/")[0];
        clean = clean.split("#")[0];
        return `https://static.wixstatic.com/media/${clean}`;
    }
    return "";
}


$w.onReady(async () => {

    // 🔥 Obj + broker info in one query
    const result = await wixData.query("OffMarketObjects")
        .eq("status", "active")
        .include("brokerId")            // <-- MAGIC LINE
        .find();

    const items = result.items.map(obj => {
        
        // Brokerio duomenys
        const b = obj.brokerId || {};   // obj.brokerId yra VISAS brokerio objektas

        return {
            title: obj.title,
            district: obj.district,
            city: obj.city,

            price: obj.price,
            area: obj.area_m_2,
            rooms: obj.rooms,

            mainImage: getImageUrl(obj.mainImage),
            gallery: (obj.gallery || []).map(g => getImageUrl(g)),

            // 🔥 Brokerio informacija čia!
            brokerName: b.name || "Capital brokeris",
            brokerAvatar: getImageUrl(b.photo),
            brokerPhone: b.phone || "",
            brokerWhatsApp: b.whatsapp || "",
            brokerMessenger: b.messenger || "",
            brokerEmail: b.email || "",

            // CTA nuoroda
            ctaUrl: `${BASE_URL}${obj["link-offmarketobjects-title"]}`
        };
    });


    console.log("FEED kortelių duomenys:", items);

    // Paduodame į iFrame
    $w("#offMarketHtml").postMessage({
        type: "offMarketData",
        items: items
    });
});
