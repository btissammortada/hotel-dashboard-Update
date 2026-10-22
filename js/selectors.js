// Relier, filtrer et calculer les données. Aucune manipulation du DOM ici.

// ---------- Relations ----------

export function findCustomer(customers, customerId) {
    return customers.find(customer => customer.id === customerId);
}

export function findProduct(products, productId) {
    return products.find(product => product.id === productId);
}

// ---------- Calculs ----------

// montant ligne = prix du produit x quantité
export function getLineAmount(products, item) {
    const product = findProduct(products, item.productId);
    return product ? product.price * item.quantity : 0;
}

// montant total = somme des montants de toutes les lignes
export function getOrderTotal(products, order) {
    let total = 0;

    order.items.forEach(item => {
        total += getLineAmount(products, item);
    });

    return total;
}

// ---------- Validation des références ----------

export function validateData({ customers, products, orders }) {
    const problems = [];

    orders.forEach(order => {
        if (!findCustomer(customers, order.customerId)) {
            problems.push(`Commande ${order.id} : client ${order.customerId} introuvable.`);
        }

        if (!Array.isArray(order.items) || order.items.length === 0) {
            problems.push(`Commande ${order.id} : aucun produit.`);
            return;
        }

        order.items.forEach(item => {
            if (!findProduct(products, item.productId)) {
                problems.push(`Commande ${order.id} : produit ${item.productId} introuvable.`);
            }
        });
    });

    return problems;
}

// ---------- Représentation enrichie ----------

export function getCategories(products) {
    return [...new Set(products.map(product => product.category))].sort();
}

function buildOrderView(state, order) {
    const customer = findCustomer(state.customers, order.customerId);

    const lines = order.items.map(item => {
        const product = findProduct(state.products, item.productId);

        return {
            productName: product ? product.name : "Produit inconnu",
            category: product ? product.category : "",
            price: product ? product.price : 0,
            quantity: item.quantity,
            amount: getLineAmount(state.products, item)
        };
    });

    return {
        id: order.id,
        date: order.date,
        status: order.status,
        customerName: customer ? customer.name : "Client inconnu",
        city: customer ? customer.city : "—",
        lines,
        total: getOrderTotal(state.products, order)
    };
}

export function getOrderDetail(state, orderId) {
    const order = state.orders.find(item => item.id === orderId);
    return order ? buildOrderView(state, order) : null;
}

// ---------- Filtres combinés ----------

export function getVisibleOrders(state) {
    const query = state.search.trim().toLocaleLowerCase("fr");

    return state.orders
        .filter(order => {
            const customer = findCustomer(state.customers, order.customerId);
            const name = customer ? customer.name.toLocaleLowerCase("fr") : "";
            return name.includes(query);
        })
        .filter(order => state.status === "Tous" || order.status === state.status)
        .filter(order => {
            if (state.category === "Toutes") return true;

            return order.items.some(item => {
                const product = findProduct(state.products, item.productId);
                return product && product.category === state.category;
            });
        })
        .map(order => buildOrderView(state, order));
}

// ---------- Indicateurs ----------

export function getStats(state) {
    let cumulated = 0;
    let delivered = 0;

    state.orders.forEach(order => {
        const total = getOrderTotal(state.products, order);
        cumulated += total;

        if (order.status === "Livree") {
            delivered += total;
        }
    });

    return {
        customers: state.customers.length,
        products: state.products.length,
        orders: state.orders.length,
        cumulated,
        delivered
    };
}