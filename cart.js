// La Costa Shopping Cart
// Testing version — prices are examples, not real menu prices.

const CART_KEY = "laCostaCart";

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(name, price, options = "") {
    const cart = getCart();

    cart.push({
        id: crypto.randomUUID(),
        name,
        price,
        options,
        quantity: 1
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
