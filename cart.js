// La Costa Shopping Cart
// Testing version — prices are examples, not real menu prices.

const CART_KEY = "laCostaCart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, total, options = [], quantity = 1) {
    const cart = getCart();

    cart.push({
        id: crypto.randomUUID(),
        name,
        price: total/quantity,
        options,
        quantity
    });

    saveCart(cart);
    alert(`${name} added to your cart!`);
}

function getCartTotal() {
    return getCart().reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );
}

function removeFromCart(id) {
    const updatedCart = getCart().filter(item => item.id !== id);
    saveCart(updatedCart);
}


// ===================================
// BANANA SPLIT ORDERING
// ===================================

const bananaSplitModal = document.getElementById("bananaSplitModal");
const openBananaSplit = document.getElementById("openBananaSplit");
const closeBananaSplit = document.getElementById("closeBananaSplit");
const addBananaSplit = document.getElementById("addBananaSplitToCart");

const bananaFlavorSelects = [
    document.getElementById("bananaFlavor1"),
    document.getElementById("bananaFlavor2"),
    document.getElementById("bananaFlavor3")
];

const bananaFlavors = [
    "Vanilla", "Chocolate", "Strawberry", "Cookie Dough",
    "Oreo", "Birthday Cake", "Coffee", "Pine Nuts",
    "Coconut", "M&Ms", "Grape", "Guava", "Pistachio",
    "Butter Pecan", "Bubble Gum", "Cotton Candy",
    "Vanilla with Chocolate Chips", "Peanut Butter",
    "Mint Chocolate Chip", "Dulce De Leche", "SourSop",
    "Corn", "Eggnog", "Blackberry with Cheese", "Rum Raisin"
];

// Fill all three flavor selectors
bananaFlavorSelects.forEach(select => {
    bananaFlavors.forEach(flavor => {
        const option = document.createElement("option");
        option.value = flavor;
        option.textContent = flavor;
        select.appendChild(option);
    });
});

openBananaSplit.addEventListener("click", () => {
    bananaSplitModal.hidden = false;
});

closeBananaSplit.addEventListener("click", () => {
    bananaSplitModal.hidden = true;
});

bananaSplitModal.addEventListener("click", event => {
    if (event.target === bananaSplitModal) {
        bananaSplitModal.hidden = true;
    }
});

addBananaSplit.addEventListener("click", () => {
    const flavors = bananaFlavorSelects.map(select => select.value);

    const toppings = Array.from(
        document.querySelectorAll(
            'input[name="bananaTopping"]:checked'
        )
    ).map(input => input.value);

    const options = [
        `Scoops: ${flavors.join(", ")}`,
        `Toppings: ${toppings.length ? toppings.join(", ") : "None"}`
    ];

    addToCart("Banana Split", 12.00, options);

    bananaSplitModal.hidden = true;
});
