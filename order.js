const iceCreamModal = document.getElementById("iceCreamModal");
const selectedFlavorText = document.getElementById("selectedFlavor");
const iceCreamSize = document.getElementById("iceCreamSize");
const quantityDisplay = document.getElementById("quantityDisplay");
const iceCreamTotal = document.getElementById("iceCreamTotal");
const addToCartButton = document.getElementById("addIceCreamToCart");

const modalTitle = document.getElementById("modalTitle");
const sizeLabel = document.querySelector('label[for="iceCreamSize"]');

const sizePrices = {
    kidsOneCone: 3.50,
    kidsOneScoop: 3.00,
    kidsTwoScoops: 5.00,
    regularOneScoop: 4.00,
    regularTwoScoops: 6.00,
    regularThreeScoops: 7.25,
    regularOneScoopCone: 4.50,
    regularTwoScoopsCone: 6.50,
    regularThreeScoopsCone: 7.75
};

const ICE_CREAM_OPTIONS = `
    <option value="kidsOneCone">1 Kids Cone — $3.50</option>
    <option value="kidsOneScoop">1 Kids Scoop — $3.00</option>
    <option value="kidsTwoScoops">2 Kids Scoops — $5.00</option>
    <option value="regularOneScoop">1 Regular Scoop — $4.00</option>
    <option value="regularTwoScoops">2 Regular Scoops — $6.00</option>
    <option value="regularThreeScoops">3 Regular Scoops — $7.25</option>
    <option value="regularOneScoopCone">1 Regular Scoop in Cone — $4.50</option>
    <option value="regularTwoScoopsCone">2 Regular Scoops in Cone — $6.50</option>
    <option value="regularThreeScoopsCone">3 Regular Scoops in Cone — $7.75</option>
`;

const MILKSHAKE_PRICE = 9.00;
const MILK_POPSICLE_PRICE = 3.50;
const POPSICLE_PRICE = 3.00;

let selectedFlavor = "";
let quantity = 1;
let selectedCategory = "icecream";

function getCurrentPrice() {
    if (selectedCategory === "milkshake") {
        return MILKSHAKE_PRICE;
    }

    if (selectedCategory === "milkPopsicle") {
        return MILK_POPSICLE_PRICE;
    }

    if (selectedCategory === "popsicle") {
        return POPSICLE_PRICE;
    }

    return sizePrices[iceCreamSize.value];
}

function updateIceCreamTotal() {
    const total = getCurrentPrice() * quantity;

    iceCreamTotal.textContent = `$${total.toFixed(2)}`;
    addToCartButton.textContent = `Add to Cart — $${total.toFixed(2)}`;
}

// Open the popup when a flavor is selected
document.querySelectorAll(".flavor-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedFlavor = button.dataset.flavor;

        const category = button.dataset.category?.toLowerCase();

        if (category === "milkshake") {
            selectedCategory = "milkshake";
        } else if (category === "milk popsicle") {
            selectedCategory = "milkPopsicle";
        } else if (category === "popsicle") {
            selectedCategory = "popsicle";
        } else {
            selectedCategory = "icecream";
        }

        quantity = 1;
        quantityDisplay.textContent = quantity;

        if (selectedCategory === "milkshake") {
            selectedFlavorText.textContent = `Milkshake Flavor: ${selectedFlavor}`;
            modalTitle.textContent = "Choose Your Milkshake";
            sizeLabel.textContent = "Your selection:";

            iceCreamSize.innerHTML =
                '<option value="regularMilkshake">Regular Milkshake — $9.00</option>';

            iceCreamSize.disabled = true;

        } else if (selectedCategory === "milkPopsicle") {
            selectedFlavorText.textContent = `Milk Popsicle Flavor: ${selectedFlavor}`;
            modalTitle.textContent = "Choose Your Milk Popsicle";
            sizeLabel.textContent = "Your selection:";

            iceCreamSize.innerHTML =
                '<option value="milkPopsicle">Milk Popsicle — $3.50</option>';

            iceCreamSize.disabled = true;
            iceCreamSize.style.pointerEvents = "none";

        } else if (selectedCategory === "popsicle") {
            selectedFlavorText.textContent = `Popsicle Flavor: ${selectedFlavor}`;
            modalTitle.textContent = "Choose Your Popsicle";
            sizeLabel.textContent = "Your selection:";

            iceCreamSize.innerHTML =
                '<option value="popsicle">Popsicle — $3.00</option>';
            iceCreamSize.disabled = true;
            iceCreamSize.style.pointerEvents = "none";
        } else {
            selectedFlavorText.textContent = `Ice Cream Flavor: ${selectedFlavor}`;
            modalTitle.textContent = "Choose Your Ice Cream";
            sizeLabel.textContent = "Choose your size:";

            iceCreamSize.innerHTML = ICE_CREAM_OPTIONS;
            iceCreamSize.disabled = false;
            iceCreamSize.style.pointerEvents = "auto";
            iceCreamSize.value = "kidsOneScoop";
        }

        iceCreamSize.hidden = false;

        updateIceCreamTotal();
        iceCreamModal.hidden = false;
    });
});

// Update price when the ice cream size changes
iceCreamSize.addEventListener("change", updateIceCreamTotal);

// Increase quantity
document.getElementById("increaseQuantity").addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
    updateIceCreamTotal();
});

// Decrease quantity, with a minimum of one
document.getElementById("decreaseQuantity").addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
        updateIceCreamTotal();
    }
});

// Add the selected item to the cart
addToCartButton.addEventListener("click", () => {
    const price = getCurrentPrice();

    let itemName;
    let options;

    if (selectedCategory === "milkshake") {
        itemName = "Milkshake";
        options = `${selectedFlavor} Milkshake`;
    } else if (selectedCategory === "milkPopsicle") {
        itemName = "Milk Popsicle";
        options = `${selectedFlavor} Milk Popsicle`;
    } else if (selectedCategory === "popsicle") {
        itemName = "Popsicle";
        options = `${selectedFlavor} Popsicle`;
    } else {
        itemName = "Ice Cream";

        const selectedSize =
            iceCreamSize.options[iceCreamSize.selectedIndex].text.split(" — ")[0];

        options = `${selectedFlavor}, ${selectedSize}`;
    }

    addToCart(itemName, price, options);

    // Apply the selected quantity to the cart item
    const cart = getCart();
    const lastItem = cart[cart.length - 1];

    if (lastItem) {
        lastItem.quantity = quantity;
        saveCart(cart);
    }

    iceCreamModal.hidden = true;
});

// Close the popup
document.getElementById("closeModal").addEventListener("click", () => {
    iceCreamModal.hidden = true;
});

// Close the popup by clicking outside its contents
iceCreamModal.addEventListener("click", event => {
    if (event.target === iceCreamModal) {
        iceCreamModal.hidden = true;
    }
});
