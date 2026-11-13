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

        if (Array.isArray(item.options)) {
            itemOptions.textContent = item.options.join(" • ");
        } else {
            itemOptions.textContent = item.options || "";
        }

        if (!itemOptions.textContent) {
            itemOptions.hidden = true;
        }

        const itemQuantity = document.createElement("div");
        itemQuantity.className = "cart-quantity-controls";

        const decreaseButton = document.createElement("button");
        decreaseButton.type = "button";
        decreaseButton.textContent = "-";

        const quantityDisplay = document.createElement("span");
        quantityDisplay.textContent = item.quantity || 1;

        const increaseButton = document.createElement("button");
        increaseButton.type = "button";
        increaseButton.textContent = "+";

        function updateItemQuantity(change) {
            const updatedCart = getCart();
        
            const cartItem = updatedCart.find(
                cartItem => cartItem.id === item.id
            );
        
            if (!cartItem) return;
        
            cartItem.quantity = Math.max(
                1,
                (cartItem.quantity || 1) + change
            );
        
            saveCart(updatedCart);
            displayCart();
        }

        decreaseButton.addEventListener("click", () => {
            updateItemQuantity(-1);
        });

        increaseButton.addEventListener("click", () => {
            updateItemQuantity(1);
        });

        itemQuantity.append(
            decreaseButton,
            quantityDisplay,
            increaseButton
        );

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
        window.location.href = "checkout.html";
    }
});

displayCart();
