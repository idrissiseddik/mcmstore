// Liste des produits
const products = [
    { id: 1, name: "T-shirt blanc MCM", price: 150, image: "tshirt.jpg" },
    { id: 1, name: "T-shirt blanc MCM", price: 150, image: "tshirt.jpg" },
    { id: 2, name: "T-shirt vert MCM", price: 250, image: "tshirt.jpg" },
    { id: 3, name: "Casquette blanc MCM", price: 100, image: "casquette.jpg" },
    { id: 3, name: "Casquette blanc MCM", price: 100, image: "casquette.jpg" },
    { id: 4, name: "Casquette verte MCM", price: 200, image: "casquette.jpg" },
    { id: 5, name: "Écharpe blanc MCM", price: 120, image: "echarpe.jpg" },
    { id: 6, name: "Écharpe verte MCM", price: 220, image: "echarpe.jpg" },
    { id: 7, name: "Écharpe MCM", price: 120, image: "echarpe.jpg" }
];

// Fonction pour afficher les produits
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
                    <p class="card-text">${product.price} MAD</p>
                    <div class="mb-3">
                        <label for="quantity${product.id}" class="form-label">Quantité</label>
                        <input type="number" id="quantity${product.id}" class="form-control" value="1" min="1">
                    </div>
                    <button class="btn btn-success" onclick="addToCart(${product.id})">Ajouter au panier</button>
                </div>
            </div>
        `;
        productList.appendChild(card);
    });
}

// Panier
let cart = [];

// Ajouter au panier
function addToCart(productId) {
    const quantity = document.getElementById(`quantity${productId}`).value;
    const product = products.find(p => p.id === productId);
    const cartItem = { ...product, quantity: parseInt(quantity) };
    
    cart.push(cartItem);
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
        const totalItem = item.price * item.quantity;
        total += totalItem;
        panierDetails.innerHTML += `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span>${item.name} - ${item.quantity} x ${item.price} MAD = ${totalItem} MAD</span>
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

// Modifier la quantité
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
        alert("Veuillez remplir tous les champs.");
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });

    const message = `Commande MCM :\n\nNuméro de téléphone : ${phone}\nAdresse : ${address}\nProduits :\n${cart.map(item => `${item.name} - ${item.quantity} x ${item.price} MAD = ${item.price * item.quantity} MAD`).join('\n')}\n\nTotal : ${total} MAD`;

    const whatsappUrl = `https://wa.me/212608975435?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    var myModal = bootstrap.Modal.getInstance(document.getElementById('panierModal'));
    myModal.hide();
});

// Initialiser les produits au chargement
window.onload = renderProducts;
