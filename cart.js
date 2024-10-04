document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.querySelector('.cart-container');
    const cartTotal = document.querySelector('.cart-total h3');
    
    // Function to render the cart items
    function renderCartItems(){
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = ''; // Clear existing items
        let totalAmount = 0; // Reset total amount

        // Loop through each item in the cart
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            const itemTotal = item.price * item.quantity; // Calculate item total

            cartItem.innerHTML = `
                <div class="product-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <label for="quantity${index}">Quantity:</label>
                    <input type="number" id="quantity${index}" value="${item.quantity}" min="1" onchange="updateTotal(${index}, ${item.price})">
                </div>
                <p class="item-total" id="item-total${index}">$${itemTotal}</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            `;
            cartContainer.appendChild(cartItem);
            totalAmount += itemTotal; // Accumulate total
        });

        // Update the total amount display
        cartTotal.textContent = `Total: $${totalAmount}`;
    }

    // Function to update total price when quantity changes
    window.updateTotal = function(index, price) {
        const quantityInput = document.getElementById(`quantity${index}`);
        const itemTotal = document.getElementById(`item-total${index}`);
        const quantity = quantityInput.value;
        const newTotal = price * quantity;
        itemTotal.textContent = `$${newTotal}`;

        // Update local storage with the new quantity
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart[index].quantity = quantity; // Update quantity
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart

        // Recalculate the total amount
        calculateTotal();
    };

    // Function to calculate total
    function calculateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let totalAmount = 0;

        cart.forEach((item, index) => {
            const quantityInput = document.getElementById(`quantity${index}`);
            totalAmount += item.price * quantityInput.value;
        });
        console.log("total",totalAmount)
        cartTotal.textContent = `Total: $${totalAmount}`;
    }

    // Function to remove an item from the cart
    window.removeItem = function(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1); // Remove the item
        localStorage.setItem('cart', JSON.stringify(cart)); // Update local storage
        renderCartItems(); // Re-render the cart items
    };

    // Initial call to render items when the page loads
    renderCartItems();
    calculateTotal();
});


// Function to update quantity in the cart
function updateQuantity(name, quantity) {
    const cart = getCart();
    const product = cart.find(item => item.name === name);
    
    if (product) {
        product.quantity = parseInt(quantity);
        saveCart(cart);
        displayCart();
    }
}

function removeFromCart(name) {
    let cart = getCart();
    cart = cart.filter(item => item.name !== name); // Remove product
    saveCart(cart);
    displayCart();
}

function addToCart(name,image,price){
        const cart = getCart();
        const product = { name, image, price };
        
        // Check if the product already exists in the cart
        const existingProduct = cart.find(item => item.name === name);
        if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity
        } else {
            product.quantity = 1; // Set initial quantity
            cart.push(product); // Add new product to the cart
        }
    
        saveCart(cart);
}
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : []; // Return parsed cart or empty array
}

// Function to save the cart to Local Storage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart)); // Save cart as string
}