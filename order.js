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


// ===================================
// CHOCO BANANA ORDERING
// ===================================

const chocoBananaModal = document.getElementById("chocoBananaModal");
const openChocoBanana = document.getElementById("openChocoBanana");
const closeChocoBanana = document.getElementById("closeChocoBanana");
const addChocoBanana = document.getElementById("addChocoBananaToCart");

const decreaseChocoBananaQuantity = document.getElementById("decreaseChocoBananaQuantity");
const increaseChocoBananaQuantity = document.getElementById("increaseChocoBananaQuantity");
const chocoBananaQuantityDisplay = document.getElementById("quantityDisplay");
const chocoBananaTotal = document.getElementById("chocoBananaTotal");

const chocoBananaPrice = 3.50;
let chocoBananaQuantity = 1;

// Update quantity and total price
function updateChocoBananaTotal() {
    chocoBananaQuantityDisplay.textContent = chocoBananaQuantity;

    const total = chocoBananaPrice * chocoBananaQuantity;
    chocoBananaTotal.textContent = `$${total.toFixed(2)}`;
}

// Open the pop-up
openChocoBanana.addEventListener("click", () => {
    chocoBananaModal.hidden = false;
    chocoBananaQuantity = 1;
    updateChocoBananaTotal();
});

// Close the pop-up
closeChocoBanana.addEventListener("click", () => {
    chocoBananaModal.hidden = true;
});

// Close when clicking outside
chocoBananaModal.addEventListener("click", event => {
    if (event.target === chocoBananaModal) {
        chocoBananaModal.hidden = true;
    }
});

// Decrease quantity
decreaseChocoBananaQuantity.addEventListener("click", () => {
    if (chocoBananaQuantity > 1) {
        chocoBananaQuantity--;
        updateChocoBananaTotal();
    }
});

// Increase quantity
increaseChocoBananaQuantity.addEventListener("click", () => {
    chocoBananaQuantity++;
    updateChocoBananaTotal();
});

// Add to cart
addChocoBanana.addEventListener("click", () => {
    const selectedTopping = document.querySelector(
        'input[name="chocoBananaTopping"]:checked'
    );

    const topping = selectedTopping ? selectedTopping.value : "None";

    const options = [`Topping: ${topping}`];

    const total = chocoBananaPrice * chocoBananaQuantity;

    addToCart(
        "Choco Banana",
        total,
        options,
        chocoBananaQuantity
    );

    chocoBananaModal.hidden = true;
});


// ===================================
// MANGONADA ORDERING
// ===================================

const mangonadaModal = document.getElementById("mangonadaModal");
const closeMangonada = document.getElementById("closeMangonada");
const addMangonada = document.getElementById("addMangonadaToCart");

const mangonadaFlavorDisplay = document.getElementById("mangonadaFlavorDisplay");
const mangonadaQuantityDisplay = document.getElementById("mangonadaQuantityDisplay");
const mangonadaTotal = document.getElementById("mangonadaTotal");

const decreaseMangonadaQuantity = document.getElementById("decreaseMangonadaQuantity");
const increaseMangonadaQuantity = document.getElementById("increaseMangonadaQuantity");

const mangonadaPrice = 9.00;
let mangonadaQuantity = 1;
let selectedMangonadaFlavor = "Mango";

// Update quantity and price
function updateMangonadaTotal() {
    mangonadaQuantityDisplay.textContent = mangonadaQuantity;

    const total = mangonadaPrice * mangonadaQuantity;
    mangonadaTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up when a flavor is selected
document.querySelectorAll(".mangonada-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedMangonadaFlavor = button.dataset.flavor;

        mangonadaFlavorDisplay.textContent =
            `Mangonada Flavor: ${selectedMangonadaFlavor}`;

        mangonadaQuantity = 1;
        updateMangonadaTotal();

        mangonadaModal.hidden = false;
    });
});

// Close pop-up
closeMangonada.addEventListener("click", () => {
    mangonadaModal.hidden = true;
});

// Close when clicking outside
mangonadaModal.addEventListener("click", event => {
    if (event.target === mangonadaModal) {
        mangonadaModal.hidden = true;
    }
});

// Decrease quantity
decreaseMangonadaQuantity.addEventListener("click", () => {
    if (mangonadaQuantity > 1) {
        mangonadaQuantity--;
        updateMangonadaTotal();
    }
});

// Increase quantity
increaseMangonadaQuantity.addEventListener("click", () => {
    mangonadaQuantity++;
    updateMangonadaTotal();
});

// Add to cart
addMangonada.addEventListener("click", () => {
    const total = mangonadaPrice * mangonadaQuantity;

    const options = [
        `Flavor: ${selectedMangonadaFlavor}`
    ];

    addToCart(
        "Mangonada",
        total,
        options,
        mangonadaQuantity
    );

    mangonadaModal.hidden = true;
});


// ===================================
// BIONICO ORDERING
// ===================================

const bionicoModal = document.getElementById("bionicoModal");
const openBionico = document.getElementById("openBionico");
const closeBionico = document.getElementById("closeBionico");
const addBionico = document.getElementById("addBionicoToCart");

const decreaseBionicoQuantity = document.getElementById("decreaseBionicoQuantity");
const increaseBionicoQuantity = document.getElementById("increaseBionicoQuantity");
const bionicoQuantityDisplay = document.getElementById("bionicoQuantityDisplay");
const bionicoTotal = document.getElementById("bionicoTotal");

const bionicoPrice = 10.00;
let bionicoQuantity = 1;

// Update quantity and total
function updateBionicoTotal() {
    bionicoQuantityDisplay.textContent = bionicoQuantity;

    const total = bionicoPrice * bionicoQuantity;
    bionicoTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up
openBionico.addEventListener("click", () => {
    bionicoQuantity = 1;
    updateBionicoTotal();
    bionicoModal.hidden = false;
});

// Close pop-up
closeBionico.addEventListener("click", () => {
    bionicoModal.hidden = true;
});

// Close when clicking outside
bionicoModal.addEventListener("click", event => {
    if (event.target === bionicoModal) {
        bionicoModal.hidden = true;
    }
});

// Decrease quantity
decreaseBionicoQuantity.addEventListener("click", () => {
    if (bionicoQuantity > 1) {
        bionicoQuantity--;
        updateBionicoTotal();
    }
});

// Increase quantity
increaseBionicoQuantity.addEventListener("click", () => {
    bionicoQuantity++;
    updateBionicoTotal();
});

// Add to cart
addBionico.addEventListener("click", () => {
    const total = bionicoPrice * bionicoQuantity;

    addToCart(
        "Bionico",
        total,
        [],
        bionicoQuantity
    );

    bionicoModal.hidden = true;
});


// ===================================
// FRESAS CON CREMA ORDERING
// ===================================

const fresasModal = document.getElementById("fresasModal");
const openFresas = document.getElementById("openFresas");
const closeFresas = document.getElementById("closeFresas");
const addFresas = document.getElementById("addFresasToCart");

const decreaseFresasQuantity = document.getElementById("decreaseFresasQuantity");
const increaseFresasQuantity = document.getElementById("increaseFresasQuantity");
const fresasQuantityDisplay = document.getElementById("fresasQuantityDisplay");
const fresasTotal = document.getElementById("fresasTotal");

const fresasPrice = 10.00;
let fresasQuantity = 1;

// Update quantity and total
function updateFresasTotal() {
    fresasQuantityDisplay.textContent = fresasQuantity;

    const total = fresasPrice * fresasQuantity;
    fresasTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up
openFresas.addEventListener("click", () => {
    fresasQuantity = 1;
    updateFresasTotal();
    fresasModal.hidden = false;
});

// Close pop-up
closeFresas.addEventListener("click", () => {
    fresasModal.hidden = true;
});

// Close when clicking outside
fresasModal.addEventListener("click", event => {
    if (event.target === fresasModal) {
        fresasModal.hidden = true;
    }
});

// Decrease quantity
decreaseFresasQuantity.addEventListener("click", () => {
    if (fresasQuantity > 1) {
        fresasQuantity--;
        updateFresasTotal();
    }
});

// Increase quantity
increaseFresasQuantity.addEventListener("click", () => {
    fresasQuantity++;
    updateFresasTotal();
});

// Add to cart
addFresas.addEventListener("click", () => {
    const toppings = Array.from(
        document.querySelectorAll(
            'input[name="fresasTopping"]:checked'
        )
    ).map(input => input.value);

    const options = [
        `Toppings: ${toppings.length ? toppings.join(", ") : "None"}`
    ];

    const total = fresasPrice * fresasQuantity;

    addToCart(
        "Fresas con Crema",
        total,
        options,
        fresasQuantity
    );

    fresasModal.hidden = true;
});


// ===================================
// FRUIT COCKTAIL ORDERING
// ===================================

const fruitCocktailModal = document.getElementById("fruitCocktailModal");
const openFruitCocktail = document.getElementById("openFruitCocktail");
const closeFruitCocktail = document.getElementById("closeFruitCocktail");
const addFruitCocktail = document.getElementById("addFruitCocktailToCart");

const decreaseFruitCocktailQuantity = document.getElementById("decreaseFruitCocktailQuantity");
const increaseFruitCocktailQuantity = document.getElementById("increaseFruitCocktailQuantity");
const fruitCocktailQuantityDisplay = document.getElementById("fruitCocktailQuantityDisplay");
const fruitCocktailTotal = document.getElementById("fruitCocktailTotal");

const fruitCocktailPrice = 10.00;
let fruitCocktailQuantity = 1;

// Update quantity and total
function updateFruitCocktailTotal() {
    fruitCocktailQuantityDisplay.textContent = fruitCocktailQuantity;

    const total = fruitCocktailPrice * fruitCocktailQuantity;
    fruitCocktailTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up
openFruitCocktail.addEventListener("click", () => {
    fruitCocktailQuantity = 1;
    updateFruitCocktailTotal();
    fruitCocktailModal.hidden = false;
});

// Close pop-up
closeFruitCocktail.addEventListener("click", () => {
    fruitCocktailModal.hidden = true;
});

// Close when clicking outside
fruitCocktailModal.addEventListener("click", event => {
    if (event.target === fruitCocktailModal) {
        fruitCocktailModal.hidden = true;
    }
});

// Decrease quantity
decreaseFruitCocktailQuantity.addEventListener("click", () => {
    if (fruitCocktailQuantity > 1) {
        fruitCocktailQuantity--;
        updateFruitCocktailTotal();
    }
});

// Increase quantity
increaseFruitCocktailQuantity.addEventListener("click", () => {
    fruitCocktailQuantity++;
    updateFruitCocktailTotal();
});

// Add to cart
addFruitCocktail.addEventListener("click", () => {
    const total = fruitCocktailPrice * fruitCocktailQuantity;

    addToCart(
        "Fruit Cocktail",
        total,
        [],
        fruitCocktailQuantity
    );

    fruitCocktailModal.hidden = true;
});


// ===================================
// AGUAS FRESCAS ORDERING
// ===================================

const aguasModal = document.getElementById("aguasModal");
const closeAguas = document.getElementById("closeAguas");
const addAguas = document.getElementById("addAguasToCart");

const aguasFlavorDisplay = document.getElementById("aguasFlavorDisplay");
const aguasSize = document.getElementById("aguasSize");
const aguasQuantityDisplay = document.getElementById("aguasQuantityDisplay");
const aguasTotal = document.getElementById("aguasTotal");

const decreaseAguasQuantity = document.getElementById("decreaseAguasQuantity");
const increaseAguasQuantity = document.getElementById("increaseAguasQuantity");

const aguasPrices = {
    Medium: 3.75,
    Large: 5.50
};

let selectedAguasFlavor = "Horchata";
let aguasQuantity = 1;

// Calculate and display total
function updateAguasTotal() {
    aguasQuantityDisplay.textContent = aguasQuantity;

    const price = aguasPrices[aguasSize.value];
    const total = price * aguasQuantity;

    aguasTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up when a flavor is selected
document.querySelectorAll(".aguas-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedAguasFlavor = button.dataset.flavor;

        aguasFlavorDisplay.textContent =
            `Flavor: ${selectedAguasFlavor}`;

        aguasQuantity = 1;
        aguasSize.value = "Medium";
        updateAguasTotal();

        aguasModal.hidden = false;
    });
});

// Close pop-up
closeAguas.addEventListener("click", () => {
    aguasModal.hidden = true;
});

// Close when clicking outside
aguasModal.addEventListener("click", event => {
    if (event.target === aguasModal) {
        aguasModal.hidden = true;
    }
});

// Change size
aguasSize.addEventListener("change", updateAguasTotal);

// Decrease quantity
decreaseAguasQuantity.addEventListener("click", () => {
    if (aguasQuantity > 1) {
        aguasQuantity--;
        updateAguasTotal();
    }
});

// Increase quantity
increaseAguasQuantity.addEventListener("click", () => {
    aguasQuantity++;
    updateAguasTotal();
});

// Add to cart
addAguas.addEventListener("click", () => {
    const size = aguasSize.value;
    const price = aguasPrices[size];
    const total = price * aguasQuantity;

    const options = [
        `Flavor: ${selectedAguasFlavor}`,
        `Size: ${size}`
    ];

    addToCart(
        "Aguas Frescas",
        total,
        options,
        aguasQuantity
    );

    aguasModal.hidden = true;
});


// ===================================
// SMOOTHIE ORDERING
// ===================================

const smoothieModal = document.getElementById("smoothieModal");
const closeSmoothie = document.getElementById("closeSmoothie");
const addSmoothie = document.getElementById("addSmoothieToCart");

const smoothieFlavorDisplay = document.getElementById("smoothieFlavorDisplay");
const smoothieQuantityDisplay = document.getElementById("smoothieQuantityDisplay");
const smoothieTotal = document.getElementById("smoothieTotal");

const decreaseSmoothieQuantity = document.getElementById("decreaseSmoothieQuantity");
const increaseSmoothieQuantity = document.getElementById("increaseSmoothieQuantity");

const smoothiePrice = 9.00;
let selectedSmoothieFlavor = "Passion Fruit";
let smoothieQuantity = 1;

// Update quantity and total
function updateSmoothieTotal() {
    smoothieQuantityDisplay.textContent = smoothieQuantity;

    const total = smoothiePrice * smoothieQuantity;
    smoothieTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up when a flavor is selected
document.querySelectorAll(".smoothie-button").forEach(button => {
    button.addEventListener("click", () => {
        selectedSmoothieFlavor = button.dataset.flavor;

        smoothieFlavorDisplay.textContent =
            `Flavor: ${selectedSmoothieFlavor}`;

        smoothieQuantity = 1;
        updateSmoothieTotal();

        smoothieModal.hidden = false;
    });
});

// Close pop-up
closeSmoothie.addEventListener("click", () => {
    smoothieModal.hidden = true;
});

// Close when clicking outside
smoothieModal.addEventListener("click", event => {
    if (event.target === smoothieModal) {
        smoothieModal.hidden = true;
    }
});

// Decrease quantity
decreaseSmoothieQuantity.addEventListener("click", () => {
    if (smoothieQuantity > 1) {
        smoothieQuantity--;
        updateSmoothieTotal();
    }
});

// Increase quantity
increaseSmoothieQuantity.addEventListener("click", () => {
    smoothieQuantity++;
    updateSmoothieTotal();
});

// Add to cart
addSmoothie.addEventListener("click", () => {
    const total = smoothiePrice * smoothieQuantity;

    const options = [
        `Flavor: ${selectedSmoothieFlavor}`
    ];

    addToCart(
        "Smoothie",
        total,
        options,
        smoothieQuantity
    );

    smoothieModal.hidden = true;
});


// ===================================
// DETOX ORDERING
// ===================================

const detoxModal = document.getElementById("detoxModal");
const openDetox = document.getElementById("openDetox");
const closeDetox = document.getElementById("closeDetox");
const addDetox = document.getElementById("addDetoxToCart");

const decreaseDetoxQuantity = document.getElementById("decreaseDetoxQuantity");
const increaseDetoxQuantity = document.getElementById("increaseDetoxQuantity");
const detoxQuantityDisplay = document.getElementById("detoxQuantityDisplay");
const detoxTotal = document.getElementById("detoxTotal");

const detoxPrice = 9.00;
let detoxQuantity = 1;

function updateDetoxTotal() {
    detoxQuantityDisplay.textContent = detoxQuantity;
    detoxTotal.textContent = `$${(detoxPrice * detoxQuantity).toFixed(2)}`;
}

openDetox.addEventListener("click", () => {
    detoxQuantity = 1;
    updateDetoxTotal();
    detoxModal.hidden = false;
});

closeDetox.addEventListener("click", () => {
    detoxModal.hidden = true;
});

detoxModal.addEventListener("click", event => {
    if (event.target === detoxModal) {
        detoxModal.hidden = true;
    }
});

decreaseDetoxQuantity.addEventListener("click", () => {
    if (detoxQuantity > 1) {
        detoxQuantity--;
        updateDetoxTotal();
    }
});

increaseDetoxQuantity.addEventListener("click", () => {
    detoxQuantity++;
    updateDetoxTotal();
});

addDetox.addEventListener("click", () => {
    addToCart("Detox", detoxPrice * detoxQuantity, [], detoxQuantity);
    detoxModal.hidden = true;
});


// ===================================
// ENERGETICO ORDERING
// ===================================

const energeticoModal = document.getElementById("energeticoModal");
const openEnergetico = document.getElementById("openEnergetico");
const closeEnergetico = document.getElementById("closeEnergetico");
const addEnergetico = document.getElementById("addEnergeticoToCart");

const decreaseEnergeticoQuantity = document.getElementById("decreaseEnergeticoQuantity");
const increaseEnergeticoQuantity = document.getElementById("increaseEnergeticoQuantity");
const energeticoQuantityDisplay = document.getElementById("energeticoQuantityDisplay");
const energeticoTotal = document.getElementById("energeticoTotal");

const energeticoPrice = 9.00;
let energeticoQuantity = 1;

function updateEnergeticoTotal() {
    energeticoQuantityDisplay.textContent = energeticoQuantity;
    energeticoTotal.textContent = `$${(energeticoPrice * energeticoQuantity).toFixed(2)}`;
}

openEnergetico.addEventListener("click", () => {
    energeticoQuantity = 1;
    updateEnergeticoTotal();
    energeticoModal.hidden = false;
});

closeEnergetico.addEventListener("click", () => {
    energeticoModal.hidden = true;
});

energeticoModal.addEventListener("click", event => {
    if (event.target === energeticoModal) {
        energeticoModal.hidden = true;
    }
});

decreaseEnergeticoQuantity.addEventListener("click", () => {
    if (energeticoQuantity > 1) {
        energeticoQuantity--;
        updateEnergeticoTotal();
    }
});

increaseEnergeticoQuantity.addEventListener("click", () => {
    energeticoQuantity++;
    updateEnergeticoTotal();
});

addEnergetico.addEventListener("click", () => {
    addToCart("Energético", energeticoPrice * energeticoQuantity, [], energeticoQuantity);
    energeticoModal.hidden = true;
});

// ===================================
// PREPARED DRINKS ORDERING
// ===================================

const preparedDrinkModal = document.getElementById("preparedDrinkModal");
const closePreparedDrink = document.getElementById("closePreparedDrink");

const decreasePreparedDrink = document.getElementById("decreasePreparedDrink");
const increasePreparedDrink = document.getElementById("increasePreparedDrink");

const preparedDrinkQuantityDisplay = document.getElementById("preparedDrinkQuantity");
const preparedDrinkTotal = document.getElementById("preparedDrinkTotal");

const addPreparedDrink = document.getElementById("addPreparedDrinkToCart");

const preparedDrinkPrice = 7.00;

let preparedDrinkQuantity = 1;
let selectedPreparedDrink = "";

// Update quantity and total
function updatePreparedDrinkTotal() {
    preparedDrinkQuantityDisplay.textContent = preparedDrinkQuantity;

    const total = preparedDrinkPrice * preparedDrinkQuantity;

    preparedDrinkTotal.textContent = `$${total.toFixed(2)}`;
}

// Open the same pop-up for all four drinks
const preparedDrinkButtons = [
    { id: "openRusa", name: "Rusa" },
    { id: "openTopoChico", name: "Topo Chico Preparado" },
    { id: "openRedBull", name: "RedBull Preparado" },
    { id: "openMonster", name: "Monster Preparado" }
];

preparedDrinkButtons.forEach(drink => {
    const button = document.getElementById(drink.id);

    button.addEventListener("click", () => {
        selectedPreparedDrink = drink.name;
        preparedDrinkQuantity = 1;

        document.getElementById("preparedDrinkTitle").textContent =
            `Order ${selectedPreparedDrink}`;

        updatePreparedDrinkTotal();

        preparedDrinkModal.hidden = false;
    });
});

// Close pop-up
closePreparedDrink.addEventListener("click", () => {
    preparedDrinkModal.hidden = true;
});

// Close when clicking outside
preparedDrinkModal.addEventListener("click", event => {
    if (event.target === preparedDrinkModal) {
        preparedDrinkModal.hidden = true;
    }
});

// Decrease quantity
decreasePreparedDrink.addEventListener("click", () => {
    if (preparedDrinkQuantity > 1) {
        preparedDrinkQuantity--;
        updatePreparedDrinkTotal();
    }
});

// Increase quantity
increasePreparedDrink.addEventListener("click", () => {
    preparedDrinkQuantity++;
    updatePreparedDrinkTotal();
});

// Add to cart
addPreparedDrink.addEventListener("click", () => {
    const total = preparedDrinkPrice * preparedDrinkQuantity;

    addToCart(
        selectedPreparedDrink,
        total,
        [],
        preparedDrinkQuantity
    );

    preparedDrinkModal.hidden = true;
});

// ===================================
// DESSERT ORDERING
// ===================================

const dessertModal = document.getElementById("dessertModal");
const closeDessert = document.getElementById("closeDessert");

const decreaseDessert = document.getElementById("decreaseDessert");
const increaseDessert = document.getElementById("increaseDessert");

const dessertQuantityDisplay = document.getElementById("dessertQuantity");
const dessertTotal = document.getElementById("dessertTotal");

const addDessert = document.getElementById("addDessertToCart");

let dessertQuantity = 1;
let selectedDessert = "";
let selectedDessertPrice = 0;

// Update quantity and total
function updateDessertTotal() {
    dessertQuantityDisplay.textContent = dessertQuantity;

    const total = selectedDessertPrice * dessertQuantity;

    dessertTotal.textContent = `$${total.toFixed(2)}`;
}

// Desserts and their prices
const dessertButtons = [
    { id: "openChocoflan", name: "Chocoflan", price: 6.00 },
    { id: "openArrozConLeche", name: "Arroz con Leche", price: 4.00 },
    { id: "openGelatina", name: "Gelatina", price: 4.00 }
];

// Open the shared dessert pop-up
dessertButtons.forEach(dessert => {
    const button = document.getElementById(dessert.id);

    button.addEventListener("click", () => {
        selectedDessert = dessert.name;
        selectedDessertPrice = dessert.price;
        dessertQuantity = 1;

        document.getElementById("dessertTitle").textContent =
            `Order ${selectedDessert}`;

        updateDessertTotal();

        dessertModal.hidden = false;
    });
});

// Close pop-up
closeDessert.addEventListener("click", () => {
    dessertModal.hidden = true;
});

// Close when clicking outside
dessertModal.addEventListener("click", event => {
    if (event.target === dessertModal) {
        dessertModal.hidden = true;
    }
});

// Decrease quantity
decreaseDessert.addEventListener("click", () => {
    if (dessertQuantity > 1) {
        dessertQuantity--;
        updateDessertTotal();
    }
});

// Increase quantity
increaseDessert.addEventListener("click", () => {
    dessertQuantity++;
    updateDessertTotal();
});

// Add to cart
addDessert.addEventListener("click", () => {
    const total = selectedDessertPrice * dessertQuantity;

    addToCart(
        selectedDessert,
        total,
        [],
        dessertQuantity
    );

    dessertModal.hidden = true;
});

// ===================================
// NACHOS ORDERING
// ===================================

const nachosModal = document.getElementById("nachosModal");
const closeNachos = document.getElementById("closeNachos");

const decreaseNachos = document.getElementById("decreaseNachos");
const increaseNachos = document.getElementById("increaseNachos");

const nachosQuantityDisplay = document.getElementById("nachosQuantity");
const nachosTotal = document.getElementById("nachosTotal");

const nachosJalapenos = document.getElementById("nachosJalapenos");
const addNachos = document.getElementById("addNachosToCart");

let nachosQuantity = 1;
let nachosPrice = 5.00;
let nachosSize = "Small";

// Get selected size
function getNachosPrice() {
    const selectedSize = document.getElementById("nachosSize");

    if (selectedSize.value === "large") {
        nachosPrice = 8.00;
        nachosSize = "Large";
    } else {
        nachosPrice = 5.00;
        nachosSize = "Small";
    }
}

// Update quantity and total
function updateNachosTotal() {
    getNachosPrice();

    nachosQuantityDisplay.textContent = nachosQuantity;

    const total = nachosPrice * nachosQuantity;

    nachosTotal.textContent = `$${total.toFixed(2)}`;
}

// Open Nachos pop-up
document.getElementById("openNachos").addEventListener("click", () => {
    nachosQuantity = 1;

    document.getElementById("nachosSize").value = "small";

    nachosJalapenos.checked = false;

    updateNachosTotal();

    nachosModal.hidden = false;
});

// Update total when size changes
document.getElementById("nachosSize").addEventListener("change", updateNachosTotal);

// Close pop-up
closeNachos.addEventListener("click", () => {
    nachosModal.hidden = true;
});

// Close when clicking outside
nachosModal.addEventListener("click", event => {
    if (event.target === nachosModal) {
        nachosModal.hidden = true;
    }
});

// Decrease quantity
decreaseNachos.addEventListener("click", () => {
    if (nachosQuantity > 1) {
        nachosQuantity--;
        updateNachosTotal();
    }
});

// Increase quantity
increaseNachos.addEventListener("click", () => {
    nachosQuantity++;
    updateNachosTotal();
});

// Add to cart
addNachos.addEventListener("click", () => {
    const options = [];

    if (nachosJalapenos.checked) {
        options.push("Jalapeños");
    }

    const total = nachosPrice * nachosQuantity;

    addToCart(
        `${nachosSize} Nachos`,
        total,
        options,
        nachosQuantity
    );

    nachosModal.hidden = true;
});

// ===================================
// CORN IN A CUP ORDERING
// ===================================

const cornCupModal = document.getElementById("cornCupModal");
const closeCornCup = document.getElementById("closeCornCup");

const cornCupSize = document.getElementById("cornCupSize");

const decreaseCornCup = document.getElementById("decreaseCornCup");
const increaseCornCup = document.getElementById("increaseCornCup");

const cornCupQuantityDisplay = document.getElementById("cornCupQuantity");
const cornCupTotal = document.getElementById("cornCupTotal");

const noChiliPowder = document.getElementById("noChiliPowder");
const noLimeJuice = document.getElementById("noLimeJuice");

const addCornCup = document.getElementById("addCornCupToCart");

let cornCupQuantity = 1;
let cornCupPrice = 6.00;
let cornCupSizeName = "Small";

// Get selected size and price
function getCornCupPrice() {
    if (cornCupSize.value === "large") {
        cornCupPrice = 9.00;
        cornCupSizeName = "Large (20 oz)";
    } else {
        cornCupPrice = 6.00;
        cornCupSizeName = "Small (12 oz)";
    }
}

// Update quantity and total
function updateCornCupTotal() {
    getCornCupPrice();

    cornCupQuantityDisplay.textContent = cornCupQuantity;

    const total = cornCupPrice * cornCupQuantity;

    cornCupTotal.textContent = `$${total.toFixed(2)}`;
}

// Open pop-up
document.getElementById("openCornCup").addEventListener("click", () => {
    cornCupQuantity = 1;
    cornCupSize.value = "small";

    noChiliPowder.checked = false;
    noLimeJuice.checked = false;

    updateCornCupTotal();

    cornCupModal.hidden = false;
});

// Update total when size changes
cornCupSize.addEventListener("change", updateCornCupTotal);

// Close pop-up
closeCornCup.addEventListener("click", () => {
    cornCupModal.hidden = true;
});

// Close when clicking outside
cornCupModal.addEventListener("click", event => {
    if (event.target === cornCupModal) {
        cornCupModal.hidden = true;
    }
});

// Decrease quantity
decreaseCornCup.addEventListener("click", () => {
    if (cornCupQuantity > 1) {
        cornCupQuantity--;
        updateCornCupTotal();
    }
});

// Increase quantity
increaseCornCup.addEventListener("click", () => {
    cornCupQuantity++;
    updateCornCupTotal();
});

// Add to cart
addCornCup.addEventListener("click", () => {
    const options = [];

    if (noChiliPowder.checked) {
        options.push("No Chili Powder");
    }

    if (noLimeJuice.checked) {
        options.push("No Lime Juice");
    }

    const total = cornCupPrice * cornCupQuantity;

    addToCart(
        `Corn in a Cup - ${cornCupSizeName}`,
        total,
        options,
        cornCupQuantity
    );

    cornCupModal.hidden = true;
});

// ===================================
// CHICHARRON PREPARADO ORDERING
// ===================================

const chicharronModal = document.getElementById("chicharronModal");
const openChicharron = document.getElementById("openChicharron");
const closeChicharron = document.getElementById("closeChicharron");
const addChicharron = document.getElementById("addChicharronToCart");

const decreaseChicharron = document.getElementById("decreaseChicharron");
const increaseChicharron = document.getElementById("increaseChicharron");

const chicharronQuantityDisplay = document.getElementById("chicharronQuantity");
const chicharronTotal = document.getElementById("chicharronTotal");

const chicharronPrice = 12.00;
let chicharronQuantity = 1;


// Update quantity and total
function updateChicharronTotal() {
    chicharronQuantityDisplay.textContent = chicharronQuantity;

    const total = chicharronPrice * chicharronQuantity;

    chicharronTotal.textContent = `$${total.toFixed(2)}`;
}


// Decrease quantity
decreaseChicharron.addEventListener("click", () => {
    if (chicharronQuantity > 1) {
        chicharronQuantity--;
        updateChicharronTotal();
    }
});


// Increase quantity
increaseChicharron.addEventListener("click", () => {
    chicharronQuantity++;
    updateChicharronTotal();
});


// Open popup
openChicharron.addEventListener("click", () => {
    chicharronQuantity = 1;
    updateChicharronTotal();
    chicharronModal.hidden = false;
});


// Close popup
closeChicharron.addEventListener("click", () => {
    chicharronModal.hidden = true;
});


// Add to cart
addChicharron.addEventListener("click", () => {
    const total = chicharronPrice * chicharronQuantity;

    addToCart(
        "Chicharrón Preparados",
        total,
        [],
        chicharronQuantity
    );

    chicharronModal.hidden = true;
});

// ===================================
// CHEESE CHEETOS ORDERING
// ===================================

const cheeseCheetosModal = document.getElementById("cheeseCheetosModal");
const openCheeseCheetos = document.getElementById("openCheeseCheetos");
const closeCheeseCheetos = document.getElementById("closeCheeseCheetos");
const addCheeseCheetos = document.getElementById("addCheeseCheetosToCart");

const decreaseCheeseCheetos = document.getElementById("decreaseCheeseCheetos");
const increaseCheeseCheetos = document.getElementById("increaseCheeseCheetos");

const cheeseCheetosQuantityDisplay = document.getElementById("cheeseCheetosQuantity");
const cheeseCheetosTotal = document.getElementById("cheeseCheetosTotal");

const cheeseCheetosPrice = 6.00;
let cheeseCheetosQuantity = 1;

function updateCheeseCheetosTotal() {
    cheeseCheetosQuantityDisplay.textContent = cheeseCheetosQuantity;
    cheeseCheetosTotal.textContent = `$${(cheeseCheetosPrice * cheeseCheetosQuantity).toFixed(2)}`;
}

decreaseCheeseCheetos.addEventListener("click", () => {
    if (cheeseCheetosQuantity > 1) {
        cheeseCheetosQuantity--;
        updateCheeseCheetosTotal();
    }
});

increaseCheeseCheetos.addEventListener("click", () => {
    cheeseCheetosQuantity++;
    updateCheeseCheetosTotal();
});

openCheeseCheetos.addEventListener("click", () => {
    cheeseCheetosQuantity = 1;
    updateCheeseCheetosTotal();
    cheeseCheetosModal.hidden = false;
});

closeCheeseCheetos.addEventListener("click", () => {
    cheeseCheetosModal.hidden = true;
});

addCheeseCheetos.addEventListener("click", () => {
    const total = cheeseCheetosPrice * cheeseCheetosQuantity;

    addToCart("Cheese Cheetos", total, [], cheeseCheetosQuantity);

    cheeseCheetosModal.hidden = true;
});


// ===================================
// CHILI CHEESE CHEETOS ORDERING
// ===================================

const chiliCheeseCheetosModal = document.getElementById("chiliCheeseCheetosModal");
const openChiliCheeseCheetos = document.getElementById("openChiliCheeseCheetos");
const closeChiliCheeseCheetos = document.getElementById("closeChiliCheeseCheetos");
const addChiliCheeseCheetos = document.getElementById("addChiliCheeseCheetosToCart");

const decreaseChiliCheeseCheetos = document.getElementById("decreaseChiliCheeseCheetos");
const increaseChiliCheeseCheetos = document.getElementById("increaseChiliCheeseCheetos");

const chiliCheeseCheetosQuantityDisplay = document.getElementById("chiliCheeseCheetosQuantity");
const chiliCheeseCheetosTotal = document.getElementById("chiliCheeseCheetosTotal");

const chiliCheeseCheetosPrice = 7.00;
let chiliCheeseCheetosQuantity = 1;

function updateChiliCheeseCheetosTotal() {
    chiliCheeseCheetosQuantityDisplay.textContent = chiliCheeseCheetosQuantity;
    chiliCheeseCheetosTotal.textContent = `$${(chiliCheeseCheetosPrice * chiliCheeseCheetosQuantity).toFixed(2)}`;
}

decreaseChiliCheeseCheetos.addEventListener("click", () => {
    if (chiliCheeseCheetosQuantity > 1) {
        chiliCheeseCheetosQuantity--;
        updateChiliCheeseCheetosTotal();
    }
});

increaseChiliCheeseCheetos.addEventListener("click", () => {
    chiliCheeseCheetosQuantity++;
    updateChiliCheeseCheetosTotal();
});

openChiliCheeseCheetos.addEventListener("click", () => {
    chiliCheeseCheetosQuantity = 1;
    updateChiliCheeseCheetosTotal();
    chiliCheeseCheetosModal.hidden = false;
});

closeChiliCheeseCheetos.addEventListener("click", () => {
    chiliCheeseCheetosModal.hidden = true;
});

addChiliCheeseCheetos.addEventListener("click", () => {
    const total = chiliCheeseCheetosPrice * chiliCheeseCheetosQuantity;

    addToCart("Chili Cheese Cheetos", total, [], chiliCheeseCheetosQuantity);

    chiliCheeseCheetosModal.hidden = true;
});


// ===================================
// CHILI CHEESE FRITOS ORDERING
// ===================================

const chiliCheeseFritosModal = document.getElementById("chiliCheeseFritosModal");
const openChiliCheeseFritos = document.getElementById("openChiliCheeseFritos");
const closeChiliCheeseFritos = document.getElementById("closeChiliCheeseFritos");
const addChiliCheeseFritos = document.getElementById("addChiliCheeseFritosToCart");

const decreaseChiliCheeseFritos = document.getElementById("decreaseChiliCheeseFritos");
const increaseChiliCheeseFritos = document.getElementById("increaseChiliCheeseFritos");

const chiliCheeseFritosQuantityDisplay = document.getElementById("chiliCheeseFritosQuantity");
const chiliCheeseFritosTotal = document.getElementById("chiliCheeseFritosTotal");

const chiliCheeseFritosPrice = 8.00;
let chiliCheeseFritosQuantity = 1;

function updateChiliCheeseFritosTotal() {
    chiliCheeseFritosQuantityDisplay.textContent = chiliCheeseFritosQuantity;
    chiliCheeseFritosTotal.textContent = `$${(chiliCheeseFritosPrice * chiliCheeseFritosQuantity).toFixed(2)}`;
}

decreaseChiliCheeseFritos.addEventListener("click", () => {
    if (chiliCheeseFritosQuantity > 1) {
        chiliCheeseFritosQuantity--;
        updateChiliCheeseFritosTotal();
    }
});

increaseChiliCheeseFritos.addEventListener("click", () => {
    chiliCheeseFritosQuantity++;
    updateChiliCheeseFritosTotal();
});

openChiliCheeseFritos.addEventListener("click", () => {
    chiliCheeseFritosQuantity = 1;
    updateChiliCheeseFritosTotal();
    chiliCheeseFritosModal.hidden = false;
});

closeChiliCheeseFritos.addEventListener("click", () => {
    chiliCheeseFritosModal.hidden = true;
});

addChiliCheeseFritos.addEventListener("click", () => {
    const total = chiliCheeseFritosPrice * chiliCheeseFritosQuantity;

    addToCart("Chili Cheese Fritos", total, [], chiliCheeseFritosQuantity);

    chiliCheeseFritosModal.hidden = true;
});

// ===============================
// CHILI CHEESE FRIES
// ===============================

const chiliCheeseFriesModal = document.getElementById("chiliCheeseFriesModal");
const chiliCheeseFriesQuantity = document.getElementById("chiliCheeseFriesQuantity");
const chiliCheeseFriesTotal = document.getElementById("chiliCheeseFriesTotal");

let chiliCheeseFriesQty = 1;
const chiliCheeseFriesPrice = 8;

function updateChiliCheeseFriesTotal() {
    chiliCheeseFriesQuantity.textContent = chiliCheeseFriesQty;
    chiliCheeseFriesTotal.textContent = `$${(chiliCheeseFriesPrice * chiliCheeseFriesQty).toFixed(2)}`;
}

document.getElementById("openChiliCheeseFries").addEventListener("click", () => {
    chiliCheeseFriesQty = 1;
    updateChiliCheeseFriesTotal();
    chiliCheeseFriesModal.hidden = false;
});

document.getElementById("closeChiliCheeseFries").addEventListener("click", () => {
    chiliCheeseFriesModal.hidden = true;
});

document.getElementById("decreaseChiliCheeseFries").addEventListener("click", () => {
    if (chiliCheeseFriesQty > 1) chiliCheeseFriesQty--;
    updateChiliCheeseFriesTotal();
});

document.getElementById("increaseChiliCheeseFries").addEventListener("click", () => {
    chiliCheeseFriesQty++;
    updateChiliCheeseFriesTotal();
});

document.getElementById("addChiliCheeseFriesToCart").addEventListener("click", () => {
    const total = chiliCheeseFriesPrice * chiliCheeseFriesQty;
    addToCart("Chili Cheese Fries", total, [], chiliCheeseFriesQty);
    chiliCheeseFriesModal.hidden = true;
});


// ===============================
// DORI LOCOS
// ===============================

const doriLocosModal = document.getElementById("doriLocosModal");
const doriLocosQuantity = document.getElementById("doriLocosQuantity");
const doriLocosTotal = document.getElementById("doriLocosTotal");

let doriLocosQty = 1;
const doriLocosPrice = 12;

function updateDoriLocosTotal() {
    doriLocosQuantity.textContent = doriLocosQty;
    doriLocosTotal.textContent = `$${(doriLocosPrice * doriLocosQty).toFixed(2)}`;
}

document.getElementById("openDoriLocos").addEventListener("click", () => {
    doriLocosQty = 1;

    document.querySelectorAll('input[name="Dori"]').forEach(input => {
        input.checked = false;
    });

    updateDoriLocosTotal();
    doriLocosModal.hidden = false;
});

document.getElementById("closeDoriLocos").addEventListener("click", () => {
    doriLocosModal.hidden = true;
});

document.getElementById("decreaseDoriLocos").addEventListener("click", () => {
    if (doriLocosQty > 1) doriLocosQty--;
    updateDoriLocosTotal();
});

document.getElementById("increaseDoriLocos").addEventListener("click", () => {
    doriLocosQty++;
    updateDoriLocosTotal();
});

document.getElementById("addDoriLocosToCart").addEventListener("click", () => {
    const total = doriLocosPrice * doriLocosQty;

    const options = Array.from(
        document.querySelectorAll('input[name="Dori"]:checked')
    ).map(input => input.value);

    addToCart("Dori Locos", total, options, doriLocosQty);
    doriLocosModal.hidden = true;
});


// ===============================
// TAKIS LOCOS
// ===============================

const takisLocosModal = document.getElementById("takisLocosModal");
const takisLocosQuantity = document.getElementById("takisLocosQuantity");
const takisLocosTotal = document.getElementById("takisLocosTotal");

let takisLocosQty = 1;
const takisLocosPrice = 12;

function updateTakisLocosTotal() {
    takisLocosQuantity.textContent = takisLocosQty;
    takisLocosTotal.textContent = `$${(takisLocosPrice * takisLocosQty).toFixed(2)}`;
}

document.getElementById("openTakisLocos").addEventListener("click", () => {
    takisLocosQty = 1;

    document.querySelectorAll('input[name="Takis"]').forEach(input => {
        input.checked = false;
    });

    updateTakisLocosTotal();
    takisLocosModal.hidden = false;
});

document.getElementById("closeTakisLocos").addEventListener("click", () => {
    takisLocosModal.hidden = true;
});

document.getElementById("decreaseTakisLocos").addEventListener("click", () => {
    if (takisLocosQty > 1) takisLocosQty--;
    updateTakisLocosTotal();
});

document.getElementById("increaseTakisLocos").addEventListener("click", () => {
    takisLocosQty++;
    updateTakisLocosTotal();
});

document.getElementById("addTakisLocosToCart").addEventListener("click", () => {
    const total = takisLocosPrice * takisLocosQty;

    const options = Array.from(
        document.querySelectorAll('input[name="Takis"]:checked')
    ).map(input => input.value);

    addToCart("Takis Locos", total, options, takisLocosQty);
    takisLocosModal.hidden = true;
});


// ===============================
// TOSTI LOCOS
// ===============================

const tostiLocosModal = document.getElementById("tostiLocosModal");
const tostiLocosQuantity = document.getElementById("tostiLocosQuantity");
const tostiLocosTotal = document.getElementById("tostiLocosTotal");

let tostiLocosQty = 1;
const tostiLocosPrice = 13;

function updateTostiLocosTotal() {
    tostiLocosQuantity.textContent = tostiLocosQty;
    tostiLocosTotal.textContent = `$${(tostiLocosPrice * tostiLocosQty).toFixed(2)}`;
}

document.getElementById("openTostiLocos").addEventListener("click", () => {
    tostiLocosQty = 1;

    document.querySelectorAll('input[name="Tosti"]').forEach(input => {
        input.checked = false;
    });

    updateTostiLocosTotal();
    tostiLocosModal.hidden = false;
});

document.getElementById("closeTostiLocos").addEventListener("click", () => {
    tostiLocosModal.hidden = true;
});

document.getElementById("decreaseTostiLocos").addEventListener("click", () => {
    if (tostiLocosQty > 1) tostiLocosQty--;
    updateTostiLocosTotal();
});

document.getElementById("increaseTostiLocos").addEventListener("click", () => {
    tostiLocosQty++;
    updateTostiLocosTotal();
});

document.getElementById("addTostiLocosToCart").addEventListener("click", () => {
    const total = tostiLocosPrice * tostiLocosQty;

    const options = Array.from(
        document.querySelectorAll('input[name="Tosti"]:checked')
    ).map(input => input.value);

    addToCart("Tosti Locos", total, options, tostiLocosQty);
    tostiLocosModal.hidden = true;
});


// ===============================
// SUPER TOSTIDOS
// ===============================

const superTostidosModal = document.getElementById("superTostidosModal");
const superTostidosQuantity = document.getElementById("superTostidosQuantity");
const superTostidosTotal = document.getElementById("superTostidosTotal");

let superTostidosQty = 1;
const superTostidosPrice = 14;

function updateSuperTostidosTotal() {
    superTostidosQuantity.textContent = superTostidosQty;
    superTostidosTotal.textContent = `$${(superTostidosPrice * superTostidosQty).toFixed(2)}`;
}

document.getElementById("openSuperTostidos").addEventListener("click", () => {
    superTostidosQty = 1;

    document.querySelectorAll('input[name="SuperTostidos"]').forEach(input => {
        input.checked = false;
    });

    updateSuperTostidosTotal();
    superTostidosModal.hidden = false;
});

document.getElementById("closeSuperTostidos").addEventListener("click", () => {
    superTostidosModal.hidden = true;
});

document.getElementById("decreaseSuperTostidos").addEventListener("click", () => {
    if (superTostidosQty > 1) superTostidosQty--;
    updateSuperTostidosTotal();
});

document.getElementById("increaseSuperTostidos").addEventListener("click", () => {
    superTostidosQty++;
    updateSuperTostidosTotal();
});

document.getElementById("addSuperTostidosToCart").addEventListener("click", () => {
    const total = superTostidosPrice * superTostidosQty;

    const options = Array.from(
        document.querySelectorAll('input[name="SuperTostidos"]:checked')
    ).map(input => input.value);

    addToCart("Super Tostidos", total, options, superTostidosQty);
    superTostidosModal.hidden = true;
});
