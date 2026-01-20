import { fetch } from 'wix-fetch';
import wixData from 'wix-data';
import { parseXmlToJson } from 'backend/crmParser.js';

// URL iš tavo CRM (pvz. Capital.lt XML export)
const CRM_URL = "http://eksportas.capitalcrm.lt/home_page/4.xml";

export async function importCRMData() {
    try {
        console.log("▶ CRM import started…");

        // 1. Atsisiunčiame XML
        const response = await fetch(CRM_URL, { method: "GET" });
        const xmlText = await response.text();

        // 2. Konvertuojame XML → JSON
        const parsed = await parseXmlToJson(xmlText);

        console.log("XML parsed:", parsed);

        // pavyzdys: parsed.objects.objectList
        const objects = parsed?.objects?.object || [];
        if (!objects.length) {
            console.warn("⚠ CRM: nerasta objektų XML faile.");
            return;
        }

        // 3. Einame per visus objektus
        for (const o of objects) {

            // slug paruošimas
            const slug = o.title.toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");

            // 4. Paruošiame duomenų įrašą
            const item = {
                title: o.title,
                price: Number(o.price) || null,
                city: o.city || "",
                district: o.district || "",
                area_m_2: Number(o.area) || null,
                rooms: Number(o.rooms) || null,
                mainImage: o.mainImage || "",
                publishedFrom: new Date(),
                link-offmarketobjects-title: `/objektai/${slug}`,
                status: "active"
            };

            // 5. Sukuriame arba atnaujiname esamą
            const existing = await wixData.query("OffMarketObjects")
                .eq("title", o.title)
                .find();

            if (existing.items.length > 0) {
                item._id = existing.items[0]._id;
                await wixData.update("OffMarketObjects", item);
                console.log("Updated:", item.title);
            } else {
                await wixData.insert("OffMarketObjects", item);
                console.log("Inserted:", item.title);
            }
        }

        console.log("✔ CRM import finished.");
        return { success: true };

    } catch (err) {
        console.error("❌ CRM import error:", err);
        return { success: false, error: err };
    }
}
