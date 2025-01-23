// Liste des produits avec prix normal et prix promo
const products = [
    { id: 1, name: "T-shirt blanc MCM", price: 150, promoPrice: 120, image: "tshirt.jpg" },
    { id: 2, name: "T-shirt vert MCM", price: 250, promoPrice: 200, image: "tshirt.jpg" },
    { id: 3, name: "Casquette blanc MCM", price: 100, promoPrice: 80, image: "casquette.jpg" },
    { id: 4, name: "Casquette verte MCM", price: 200, promoPrice: 150, image: "casquette.jpg" },
    { id: 5, name: "Écharpe blanc MCM", price: 120, promoPrice: 100, image: "echarpe.jpg" },
    { id: 6, name: "Écharpe verte MCM", price: 220, promoPrice: 180, image: "echarpe.jpg" },
    { id: 7, name: "Écharpe MCM", price: 120, promoPrice: 100, image: "echarpe.jpg" }
];

// Fonction pour afficher les produits avec le prix promo
function renderProducts() {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('col-md-4');
        card.innerHTML = `
            <div class="card mb-4">
                <img src="${product.image}" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">
                        ${product.promoPrice ? `<span class="text-muted" style="text-decoration: line-through;">${product.price} MAD</span>` : ''} 
                        ${product.promoPrice ? `<span class="text-success">${product.promoPrice} MAD</span>` : `${product.price} MAD`}
                    </p>
                    <div class="mb-3 d-flex align-items-center">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateQuantity(${product.id}, -1)">-</button>
                        <input type="number" id="quantity${product.id}" class="form-control text-center" value="1" min="1" style="width: 70px;">
                        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="updateQuantity(${product.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-success" onclick="addToCart(${product.id})">Ajouter au panier</button>
                </div>
            </div>
        `;
        productList.appendChild(card);
    });
}

// Fonction pour mettre à jour la quantité
function updateQuantity(productId, change) {
    const quantityInput = document.getElementById(`quantity${productId}`);
    let currentValue = parseInt(quantityInput.value);
    if (isNaN(currentValue)) currentValue = 1; // Valeur par défaut si l'entrée est invalide
    const newValue = currentValue + change;

    if (newValue < 1) {
        // Afficher la modale avec un message si la quantité devient inférieure à 1
        showQuantityNotification("La quantité ne peut pas être inférieure à 1.");
        return;
    }

    // Mise à jour de la quantité si elle est valide
    quantityInput.value = newValue;
}

// Panier
let cart = [];

// Ajouter au panier
function addToCart(productId) {
    const quantity = document.getElementById(`quantity${productId}`).value;
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        // Si le produit est déjà dans le panier, on met à jour la quantité
        existingItem.quantity += parseInt(quantity);
    } else {
        // Sinon, on l'ajoute
        const cartItem = { ...product, quantity: parseInt(quantity) };
        cart.push(cartItem);
    }

    updateCartDisplay();
}

// Mettre à jour l'affichage du panier
function updateCartDisplay() {
    const panierCount = document.getElementById('panierCount');
    const panierDetails = document.getElementById('panierDetails');

    panierCount.textContent = cart.length;

    let total = 0;
    panierDetails.innerHTML = '';
    cart.forEach((item, index) => {
        const totalItem = item.promoPrice ? item.promoPrice * item.quantity : item.price * item.quantity;
        total += totalItem;
        panierDetails.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.name} - ${item.quantity} x ${item.promoPrice ? item.promoPrice : item.price} MAD = ${totalItem} MAD</span>
                <button class="btn btn-warning btn-sm" onclick="editItem(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
    });

    panierDetails.innerHTML += `<div class="d-flex justify-content-between">
        <strong>Total:</strong><strong>${total} MAD</strong>
    </div>`;
}

// Modifier la quantité d'un produit dans le panier
function editItem(index) {
    const item = cart[index];
    const newQuantity = prompt(`Modifiez la quantité pour ${item.name}`, item.quantity);
    if (newQuantity) {
        cart[index].quantity = parseInt(newQuantity);
        updateCartDisplay();
    }
}

// Supprimer un élément du panier
function removeItem(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Validation de la commande
document.getElementById('validerCommande').addEventListener('click', function() {
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!phone || !address) {
        // Afficher la modale de notification pour champs manquants
        showNotification("Veuillez remplir votre numéro de téléphone et votre adresse Merci !.");
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.promoPrice ? item.promoPrice * item.quantity : item.price * item.quantity;
    });

    const message = `Commande MCM :\n\nNuméro de téléphone : ${phone}\nAdresse : ${address}\nProduits :\n${cart.map(item => `${item.name} - ${item.quantity} x ${item.promoPrice ? item.promoPrice : item.price} MAD = ${item.promoPrice ? item.promoPrice * item.quantity : item.price * item.quantity} MAD`).join('\n')}\n\nTotal : ${total} MAD`;

    const whatsappUrl = `https://wa.me/212608975435?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    var myModal = bootstrap.Modal.getInstance(document.getElementById('panierModal'));
    myModal.hide();
});

// Fonction pour afficher les messages dans la modale
function showNotification(message) {
    const messageElement = document.getElementById('notificationMessage');
    messageElement.textContent = message;

    const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
    notificationModal.show();
}

// Fonction pour afficher les notifications spécifiques à la quantité
function showQuantityNotification(message) {
    const messageElement = document.getElementById('quantityNotificationMessage');
    messageElement.textContent = message;  // Insère le message dans la modale

    const notificationModal = new bootstrap.Modal(document.getElementById('quantityNotificationModal'));
    notificationModal.show();
}

// Initialiser les produits au chargement
window.onload = renderProducts;
