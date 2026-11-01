const cartItemsContainer = document.getElementById("cartItems");
const cartTotalDisplay = document.getElementById("cartTotal");
const emptyCartMessage = document.getElementById("emptyCartMessage");
const checkoutButton = document.getElementById("checkoutButton");

function displayCart() {
    const cart = getCart();

    cartItemsContainer.replaceChildren();

    emptyCartMessage.hidden = cart.length > 0;
    checkoutButton.disabled = cart.length === 0;

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "cart-item";

        const itemName = document.createElement("h3");
        itemName.textContent = item.name;

        const itemOptions = document.createElement("p");
        itemOptions.textContent = item.options;

        const itemQuantity = document.createElement("p");
        itemQuantity.textContent = `Quantity: ${item.quantity}`;

        const itemPrice = document.createElement("p");
        itemPrice.textContent =
            `$${(item.price * item.quantity).toFixed(2)}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.id);
            displayCart();
        });

        itemElement.append(
            itemName,
            itemOptions,
            itemQuantity,
            itemPrice,
            removeButton
        );

        cartItemsContainer.appendChild(itemElement);
    });

    cartTotalDisplay.textContent = `$${getCartTotal().toFixed(2)}`;
}

checkoutButton.addEventListener("click", () => {
    if (getCart().length > 0) {
        alert("Your cart is ready! We'll set up checkout next.");
    }
});

displayCart();
