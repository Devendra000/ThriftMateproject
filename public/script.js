// Sample product data (you can replace this with your own data)
const products = [
    { id: 1, name: "Product 1", status: "Pending" },
    { id: 2, name: "Product 2", status: "Pending" },
    { id: 3, name: "Product 3", status: "Pending" }
];

// Function to display products in the HTML
function displayProducts() {
    const productContainer = document.querySelector('.product-list');
    
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <p>${product.name} (Status: ${product.status})</p>
            <button class="accept-btn" data-id="${product.id}">Accept</button>
            <button class="reject-btn" data-id="${product.id}">Reject</button>
        `;
        productContainer.appendChild(productDiv);

        const acceptBtn = productDiv.querySelector('.accept-btn');
        const rejectBtn = productDiv.querySelector('.reject-btn');

        acceptBtn.addEventListener('click', () => {
            // Update the status of the product to "Accepted"
            product.status = "Accepted";
            displayProducts();
        });

        rejectBtn.addEventListener('click', () => {
            // Update the status of the product to "Rejected"
            product.status = "Rejected";
            displayProducts();
        });
    });
}

// Initial display of products
displayProducts();
