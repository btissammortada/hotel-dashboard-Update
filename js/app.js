import { state } from "./state.js";
import { loadAllData } from "./dataService.js";
import {
    getVisibleOrders,
    getStats,
    getCategories,
    getOrderDetail,
    validateData
} from "./selectors.js";
import {
    renderStats,
    renderCategoryOptions,
    renderStatusButtons,
    renderOrders,
    renderError,
    showOrderDetail
} from "./view.js";

// Rendu complet à partir du state (peut être rappelé à chaque changement)
function render() {
    renderError(state.error);
    if (state.error) return;

    renderStats(getStats(state));
    renderStatusButtons(state.status);
    renderOrders(getVisibleOrders(state));
}

// Chargement initial + premier rendu
async function initApp() {
    try {
        const data = await loadAllData();

        const problems = validateData(data);
        if (problems.length > 0) {
            throw new Error("Données incohérentes : " + problems.join(" "));
        }

        state.customers = data.customers;
        state.products = data.products;
        state.orders = data.orders;
        state.error = null;

        renderCategoryOptions(getCategories(state.products), state.category);
    } catch (error) {
        console.error("Erreur d'initialisation :", error);
        state.error = "Erreur : " + error.message;
    }

    render();
}

// ---------- Événements : action -> state -> render() ----------

document.getElementById("searchInput").addEventListener("input", event => {
    state.search = event.target.value;
    render();
});

document.querySelectorAll(".status-btn").forEach(button => {
    button.addEventListener("click", () => {
        state.status = button.dataset.status;
        render();
    });
});

document.getElementById("categoryFilter").addEventListener("change", event => {
    state.category = event.target.value;
    render();
});

document.getElementById("ordersTableBody").addEventListener("click", event => {
    const button = event.target.closest("[data-order-id]");
    if (!button) return;

    const order = getOrderDetail(state, Number(button.dataset.orderId));
    if (order) showOrderDetail(order);
});

initApp();