
const checkoutItems = document.getElementById("checkoutItems");
const checkoutTotal = document.getElementById("checkoutTotal");

function displayCheckout() {
    const cart = getCart();

    checkoutItems.replaceChildren();

    if (cart.length === 0) {
        checkoutItems.textContent = "Your cart is empty.";
        checkoutTotal.textContent = "$0.00";
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "checkout-item";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const options = document.createElement("p");
        options.textContent = Array.isArray(item.options)
            ? item.options.join(" • ")
            : item.options || "";

        const quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${item.quantity}`;

        const price = document.createElement("p");
        price.textContent =
            `$${(item.price * item.quantity).toFixed(2)}`;

        itemElement.append(name, options, quantity, price);
        checkoutItems.appendChild(itemElement);
    });

    checkoutTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

displayCheckout();


// Pickup preference selection

const pickupOptions = document.querySelectorAll(
    'input[name="pickupPreference"]'
);

const futurePickupDetails = document.getElementById(
    "futurePickupDetails"
);

const pickupDate = document.getElementById("pickupDate");
const pickupTime = document.getElementById("pickupTime");
const specialInstructions = document.getElementById(
    "specialInstructions"
);

function updatePickupPreference() {
    const selectedPreference = document.querySelector(
        'input[name="pickupPreference"]:checked'
    ).value;

    const isFuturePickup = selectedPreference === "Future Pickup";

    futurePickupDetails.hidden = !isFuturePickup;

    pickupDate.disabled = !isFuturePickup;
    pickupTime.disabled = !isFuturePickup;
    specialInstructions.disabled = !isFuturePickup;

    pickupDate.required = isFuturePickup;
    pickupTime.required = isFuturePickup;
}

pickupOptions.forEach(option => {
    option.addEventListener("change", updatePickupPreference);
});

// Set the correct initial state
updatePickupPreference();


// Set minimum pickup date to today
const today = new Date();
const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

pickupDate.min = localToday;

// Update available pickup hours based on selected date


function updatePickupHours() {
    if (!pickupDate.value) return;

    const selectedDate = new Date(
        pickupDate.value + "T12:00:00"
    );

    const day = selectedDate.getDay();

    const openingHour = day === 0 ? 10 : 11;
    const closingHour = day === 0 ? 20 : 21;

    // Last pickup is 10 minutes before closing
    const lastPickupMinutes = closingHour * 60 - 10;

    pickupTime.replaceChildren();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Choose a pickup time";
    pickupTime.appendChild(placeholder);

    const now = new Date();

    for (
        let minutes = openingHour * 60;
        minutes <= lastPickupMinutes;
        minutes += 5
    ) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;

        const timeValue =
            String(hour).padStart(2, "0") +
            ":" +
            String(minute).padStart(2, "0");

        // Exclude pickup times that have already passed
        if (pickupDate.value === localToday) {
            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            if (minutes <= currentMinutes) continue;
        }

        const displayHour = hour % 12 || 12;
        const ampm = hour >= 12 ? "PM" : "AM";

        const displayTime =
            `${displayHour}:${String(minute).padStart(2, "0")} ${ampm}`;

        const option = document.createElement("option");
        option.value = timeValue;
        option.textContent = displayTime;

        pickupTime.appendChild(option);
    }

    if (pickupTime.options.length === 1) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No pickup times available";
        option.disabled = true;
        pickupTime.appendChild(option);
    }
}

pickupDate.addEventListener("change", updatePickupHours);

// Checkout form validation
const checkoutForm = document.getElementById("checkoutForm");

checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const cart = getCart();

    // Check for empty cart
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        window.location.href = "menu.html";
        return;
    }

    // Customer information
    const customerName = document.getElementById("customerName").value.trim();
    const customerEmail = document.getElementById("customerEmail").value.trim();
    const customerPhone = document.getElementById("customerPhone").value.trim();

    if (!customerName || !customerEmail || !customerPhone) {
        alert("Please complete all customer information.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(customerEmail)) {
        alert("Please enter a valid email address.");
        return;
    }

    const phoneDigits = customerPhone.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Pickup preference
    const selectedPickup = document.querySelector(
        'input[name="pickupPreference"]:checked'
    );

    if (!selectedPickup) {
        alert("Please select a pickup preference.");
        return;
    }

    // Validate future pickup
    if (selectedPickup.value === "Future Pickup") {

        if (!pickupDate.value || !pickupTime.value) {
            alert("Please select a pickup date and time.");
            return;
        }

        if (pickupDate.value < localToday) {
            alert("Please select a future date.");
            return;
        }

        const selectedDate = new Date(
            pickupDate.value + "T12:00:00"
        );

        const day = selectedDate.getDay();

        const openingTime = day === 0 ? 600 : 660;
        const closingTime = day === 0 ? 1200 : 1260;

        const lastPickupTime = closingTime - 10;

        const [hour, minute] = pickupTime.value.split(":").map(Number);

        const selectedMinutes = hour * 60 + minute;

        if (
            selectedMinutes < openingTime ||
            selectedMinutes > lastPickupTime ||
            minute % 5 !== 0
        ) {
            alert("Please select a valid pickup time during business hours.");
            return;
        }

        // Prevent past pickup times today
        if (pickupDate.value === localToday) {
            const now = new Date();
            const currentMinutes =
                now.getHours() * 60 + now.getMinutes();

            if (selectedMinutes <= currentMinutes) {
                alert("Please select a pickup time that hasn't passed.");
                return;
            }
        }
    }

    alert("Your information and pickup details are valid!");
});

const customerPhoneInput = document.getElementById("customerPhone");

customerPhoneInput.addEventListener("input", function() {
    let digits = this.value.replace(/\D/g, "").slice(0, 10);

    if (digits.length > 6) {
        digits = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} - ${digits.slice(6)}`;
    } else if (digits.length > 3) {
        digits = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
        digits = `(${digits}`;
    }

    this.value = digits;
});


