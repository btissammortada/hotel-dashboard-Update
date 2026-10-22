// Affichage dans le DOM. Aucun fetch ici.

const formatMAD = value => `${value.toLocaleString("fr-FR")} MAD`;
const formatDate = date => new Date(date).toLocaleDateString("fr-FR", { timeZone: "UTC" });

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function statusClass(status) {
    return {
        "Livree": "status-livree",
        "En attente": "status-attente",
        "Annulee": "status-annulee"
    }[status] || "";
}

export function renderStats(stats) {
    document.getElementById("totalCustomers").textContent = stats.customers;
    document.getElementById("totalProducts").textContent = stats.products;
    document.getElementById("totalOrders").textContent = stats.orders;
    document.getElementById("totalAmount").textContent = formatMAD(stats.cumulated);
    document.getElementById("deliveredAmount").textContent = formatMAD(stats.delivered);
}

export function renderCategoryOptions(categories, selected) {
    const select = document.getElementById("categoryFilter");

    select.innerHTML =
        `<option value="Toutes">Toutes les catégories</option>` +
        categories.map(category =>
            `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`
        ).join("");

    select.value = selected;
}

export function renderStatusButtons(selected) {
    document.querySelectorAll(".status-btn").forEach(button => {
        const active = button.dataset.status === selected;
        button.classList.toggle("btn-dark", active);
        button.classList.toggle("active", active);
        button.classList.toggle("btn-outline-dark", !active);
    });
}

export function renderOrders(orders) {
    const tbody = document.getElementById("ordersTableBody");

    document.getElementById("resultCount").textContent =
        `${orders.length} commande(s) trouvée(s)`;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    Aucune commande trouvée.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td class="fw-bold">#${order.id}</td>
            <td>${escapeHtml(order.customerName)}</td>
            <td>${escapeHtml(order.city)}</td>
            <td>${formatDate(order.date)}</td>
            <td><span class="status ${statusClass(order.status)}">${escapeHtml(order.status)}</span></td>
            <td class="fw-semibold">${formatMAD(order.total)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" data-order-id="${order.id}">
                    Détails
                </button>
            </td>
        </tr>
    `).join("");
}

export function renderError(message) {
    const box = document.getElementById("errorMessage");

    if (!message) {
        box.classList.add("d-none");
        box.textContent = "";
        return;
    }

    box.classList.remove("d-none");
    box.textContent = message;
    document.getElementById("resultCount").textContent = "Impossible d'afficher les commandes.";
    document.getElementById("ordersTableBody").innerHTML = "";
}

export function showOrderDetail(order) {
    document.getElementById("modalTitle").textContent = `Commande #${order.id}`;
    document.getElementById("modalOrderId").textContent = `#${order.id}`;
    document.getElementById("modalCustomer").textContent = order.customerName;
    document.getElementById("modalCity").textContent = order.city;
    document.getElementById("modalDate").textContent = formatDate(order.date);
    document.getElementById("modalStatus").textContent = order.status;

    document.getElementById("modalItems").innerHTML = order.lines.map(line => `
        <tr>
            <td>${escapeHtml(line.productName)}</td>
            <td class="text-end">${formatMAD(line.price)}</td>
            <td class="text-end">${line.quantity}</td>
            <td class="text-end">${formatMAD(line.amount)}</td>
        </tr>
    `).join("");

    document.getElementById("modalTotal").textContent = formatMAD(order.total);

    const modalElement = document.getElementById("orderModal");
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
}

