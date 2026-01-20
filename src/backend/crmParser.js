export function parseXmlToJson(xml) {
    return new Promise((resolve, reject) => {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xml, "text/xml");

            const objects = [...xmlDoc.getElementsByTagName("object")].map(node => ({
                id: get(node, "id"),
                title: get(node, "title"),
                city: get(node, "city"),
                district: get(node, "district"),
                price: get(node, "price"),
                area: get(node, "area"),
                rooms: get(node, "rooms"),
                mainImage: get(node, "pictures picture")
            }));

            resolve({ objects });
        } catch (err) {
            reject(err);
        }
    });
}

function get(node, path) {
    try {
        const p = path.split(" ");
        let val = node;

        p.forEach(level => {
            val = val.getElementsByTagName(level)[0];
        });

        return val?.textContent || "";
    } catch {
        return "";
    }
}
