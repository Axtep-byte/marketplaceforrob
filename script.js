/* ===== Catalog ===== */
async function loadCatalog() {
    const data = await (await fetch("products.json")).json();
    const box = document.getElementById("catalog");

    data.forEach(p => {
        box.innerHTML += `
            <div class="card" style="animation-delay:${Math.random()*0.3}s">
                <img src="img/1.jpg">
                <h3>${p.name}</h3>
                <p>${p.price} ₽</p>
                <a class="btn" href="product.html?id=${p.id}">Подробнее</a>
            </div>
        `;
    });
}

/* ===== Product Page ===== */
async function loadProductPage() {
    const id = new URLSearchParams(location.search).get("id");
    const data = await (await fetch("products.json")).json();
    const p = data.find(x => x.id == id);

    document.getElementById("product-details").innerHTML = `
        <img src="img/1.jpg">
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <h3>${p.price} ₽</h3>
        <button onclick="addToCart(${p.id})">Добавить в корзину</button>
    `;
}

/* ===== Cart Logic ===== */
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[id] = (cart[id] || 0) + 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function minus(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[id]--;
    if (cart[id] <= 0) delete cart[id];
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function plus(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[id]++;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    delete cart[id];
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    loadCart();
}

async function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const data = await (await fetch("products.json")).json();
    const box = document.getElementById("cart");

    if (!Object.keys(cart).length) {
        box.innerHTML = "<h3>Корзина пустая</h3>";
        return;
    }

    let html = "";
    let total = 0;

    for (let id in cart) {
        const p = data.find(x => x.id == id);
        const count = cart[id];
        const sum = p.price * count;
        total += sum;

        html += `
            <div class="cart-item">
                <img src="img/1.jpg">
                <div>
                    <h3>${p.name}</h3>
                    <p>${p.price} ₽ × ${count} = <b>${sum} ₽</b></p>
                    <div class="counter">
                        <button onclick="minus(${id})">–</button>
                        <button onclick="plus(${id})">+</button>
                        <button class="delete-btn" onclick="removeItem(${id})">Удалить</button>
                    </div>
                </div>
            </div>
        `;
    }

    box.innerHTML = html + `
        <div class="total">Итого: ${total} ₽</div>
        <button class="clear-btn" onclick="clearCart()">Очистить корзину</button>
    `;
}

/* ===== Dark Mode Toggle ===== */
function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

window.onload = () => {
    if(localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
}
