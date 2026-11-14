// La Costa Shopping Cart
// Testing version — prices are examples, not real menu prices.

const CART_KEY = "laCostaCart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));

    if (typeof renderSidebarCart === "function") {
        renderSidebarCart();
    }
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

function renderSidebarCart() {
    const itemsContainer = document.getElementById("sidebarCartItems");
    const countElement = document.getElementById("sidebarCartCount");
    const totalElement = document.getElementById("sidebarCartTotal");
    const checkoutButton = document.getElementById("sidebarCheckoutButton");

    // Cart sidebar only exists on the menu page
    if (!itemsContainer) return;

    const cart = getCart();

    const itemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    countElement.textContent =
        `${itemCount} ${itemCount === 1 ? "item" : "items"}`;

    totalElement.textContent = `$${getCartTotal().toFixed(2)}`;

    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
        itemsContainer.innerHTML = `
            <p class="sidebar-empty-message">
                Your cart is empty. Add something delicious!
            </p>
        `;
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "sidebar-cart-item";

        const name = document.createElement("strong");
        name.textContent = item.name;

        const options = document.createElement("p");
        options.textContent = Array.isArray(item.options)
            ? item.options.join(" • ")
            : item.options || "";

        const price = document.createElement("p");
        price.textContent =
            `$${(item.price * item.quantity).toFixed(2)}`;

        const quantityControls = document.createElement("div");
        quantityControls.className = "sidebar-quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.textContent = "−";
        minusButton.type = "button";

        minusButton.addEventListener("click", () => {
            const updatedCart = getCart();
            const currentItem = updatedCart.find(i => i.id === item.id);

            if (currentItem && currentItem.quantity > 1) {
                currentItem.quantity--;
                saveCart(updatedCart);
            }
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.textContent = "+";
        plusButton.type = "button";

        plusButton.addEventListener("click", () => {
            const updatedCart = getCart();
            const currentItem = updatedCart.find(i => i.id === item.id);

            if (currentItem) {
                currentItem.quantity++;
                saveCart(updatedCart);
            }
        });

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.type = "button";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
        });

        quantityControls.append(minusButton, quantity, plusButton);

        itemElement.append(
            name,
            options,
            price,
            quantityControls,
            removeButton
        );

        itemsContainer.appendChild(itemElement);
    });

    checkoutButton.disabled = false;
}

// Open checkout page
const sidebarCheckoutButton =
    document.getElementById("sidebarCheckoutButton");

if (sidebarCheckoutButton) {
    sidebarCheckoutButton.addEventListener("click", () => {
        if (getCart().length === 0) {
            alert("Your cart is empty!");
            return;
        }

        window.location.href = "checkout.html";
    });
}

// Display cart when the menu page loads
renderSidebarCart();

// MOBILE CART DRAWER CONTROLS

const mobileCartButton = document.getElementById("mobileCartButton");
const closeMobileCart = document.getElementById("closeMobileCart");
const cartOverlay = document.getElementById("cartOverlay");
const cartSidebar = document.getElementById("cartSidebar");

function openMobileCart() {
    cartSidebar.classList.add("mobile-cart-open");
    cartOverlay.classList.add("mobile-cart-open");
}

function closeMobileCartDrawer() {
    cartSidebar.classList.remove("mobile-cart-open");
    cartOverlay.classList.remove("mobile-cart-open");
}

if (mobileCartButton) {
    mobileCartButton.addEventListener("click", openMobileCart);
}

if (closeMobileCart) {
    closeMobileCart.addEventListener("click", closeMobileCartDrawer);
}

if (cartOverlay) {
    cartOverlay.addEventListener("click", closeMobileCartDrawer);
}

// Update the item count on the mobile button
function updateMobileCartCount() {
    const countElement = document.getElementById("mobileCartCount");

    if (!countElement) return;

    const count = getCart().reduce(
        (total, item) => total + item.quantity,
        0
    );

    countElement.textContent = count;
}

updateMobileCartCount();