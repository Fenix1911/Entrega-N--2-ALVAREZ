const socket = io();

const productList = document.getElementById("productList");


socket.on("initialProducts", (products) => {
    renderProducts(products);
});

socket.on("updatedProducts", (products) => {
    renderProducts(products);
});


function renderProducts(products) {
    productList.innerHTML = "";
    products.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.title} - $${p.price}`;
        productList.appendChild(li);
    });
}