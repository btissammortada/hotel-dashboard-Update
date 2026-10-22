// Chargement des données. Aucune manipulation du DOM ici.

async function loadJSON(fileName) {
    const url = new URL(`../data/${fileName}`, import.meta.url);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Impossible de charger ${fileName} (HTTP ${response.status})`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
        throw new Error(`${fileName} doit contenir un tableau JSON.`);
    }

    return data;
}

export async function loadAllData() {
    try {
        const [customers, products, orders] = await Promise.all([
            loadJSON("customers.json"),
            loadJSON("products.json"),
            loadJSON("orders.json")
        ]);

        return { customers, products, orders };
    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        throw error; // l'erreur remonte vers app.js qui l'affiche
    }
}