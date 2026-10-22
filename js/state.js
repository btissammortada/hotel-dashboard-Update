// État central de l'application.
// Au démarrage, les trois tableaux sont vides : ils sont remplis après le chargement.
export const state = {
    customers: [],
    products: [],
    orders: [],

    search: "",
    status: "Tous",
    category: "Toutes",

    error: null
};