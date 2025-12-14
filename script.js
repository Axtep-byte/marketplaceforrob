/* ===========================
      THEME
=========================== */
function applyTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

window.addEventListener("load", applyTheme);

/* ===========================
      PRODUCTS FETCH
=========================== */
async function getProducts() {
    const res = await fetch("products.json");
    const data = await res.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
}

/* ===========================
      PROFILE LOGIC
=========================== */
function showProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const reg = document.getElementById("register-section");
    const login = document.getElementById("login-section");
    const userSec = document.getElementById("user-section");
    if (!user) {
        reg.style.display = "block";
        login.style.display = "none";
        userSec.style.display = "none";
    } else {
        reg.style.display = "none";
        login.style.display = "none";
        userSec.style.display = "block";
        document.getElementById("user-name").innerText = "Привет, " + user.login;
        document.getElementById("user-balance").innerText = user.balance;
    }
}

function toggleProfileMenu() {
    const menu = document.getElementById("profile-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function registerUser() {
    const login = document.getElementById("reg-login").value;
    const password = document.getElementById("reg-password").value;
    if (!login || !password) return alert("Заполните все поля!");
    const user = { login, password, balance: 1000 };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Регистрация успешна!");
    showProfile();
}

function loginUser() {
    const login = document.getElementById("login-login").value;
    const password = document.getElementById("login-password").value;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return alert("Сначала зарегистрируйтесь!");
    if (login === user.login && password === user.password) {
        alert("Вход успешен!");
        showProfile();
    } else alert("Неверный логин или пароль!");
}

function logoutUser() {
    localStorage.removeItem("user");
    showProfile();
}

/* ===========================
      PRODUCTS FETCH
=========================== */
async function getProducts() {
    const res = await fetch("products.json");
    const data = await res.json();
    localStorage.setItem("products", JSON.stringify(data)); // для корзины
    return data;
}

/* ===========================
      CATALOG PAGE
=========================== */
async function loadCatalog() {
    const data = await getProducts();
    const box = document.getElementById("catalog");
    box.innerHTML = "";
    data.forEach((p, i) => {
        box.innerHTML += `
        <div class="card fade-up" style="animation-delay:${i * 0.1}s">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.price.toLocaleString()} ₽</p>
            <a class="btn" href="product.html?id=${p.id}">Подробнее</a>
        </div>
        `;
    });
}

/* ===========================
      PRODUCT PAGE
=========================== */
async function loadProductPage() {
    const id = new URLSearchParams(location.search).get("id");
    const data = await getProducts();
    const p = data.find(x => x.id == id);
    document.getElementById("product-details").innerHTML = `
        <img src="${p.img}" alt="${p.name}">
        <h2>${p.name}</h2>
        <p class="description">${p.description}</p>
        <h3 class="price-big">${p.price.toLocaleString()} ₽</h3>
        <button onclick="addToCart(${p.id})" class="btn add-btn">Добавить в корзину</button>
    `;
}

/* ===========================
      CART CORE
=========================== */
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (!cart[id]) cart[id] = 0;
    cart[id]++;
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Товар добавлен в корзину!");
}

function plus(id) {
    let cart = JSON.parse(localStorage.getItem("cart") || "{}");
    cart[id]++;
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

/* ===========================
      CART PAGE
=========================== */
async function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    const data = await getProducts();
    const box = document.getElementById("cart");
    if (!Object.keys(cart).length) {
        box.innerHTML = `<h3 class="empty fade-in">Корзина пустая</h3>`;
        return;
    }

    let html = "";
    let total = 0;
    Object.keys(cart).forEach(id => {
        const p = data.find(x => x.id == id);
        const count = cart[id];
        const sum = count * p.price;
        total += sum;
        html += `
        <div class="cart-item fade-up">
            <img src="${p.img}" alt="${p.name}">
            <div class="cart-info">
                <h3>${p.name}</h3>
                <p class="cart-price">${p.price.toLocaleString()} ₽ × ${count} = 
                <b>${sum.toLocaleString()} ₽</b></p>
                <div class="counter">
                    <button onclick="minus(${id})">–</button>
                    <button onclick="plus(${id})">+</button>
                    <button class="delete-btn" onclick="removeItem(${id})">Удалить</button>
                </div>
            </div>
        </div>
        `;
    });

    html += `
        <div class="total fade-in">Итого: <b>${total.toLocaleString()} ₽</b></div>
        <button class="clear-btn fade-up" onclick="clearCart()">Очистить корзину</button>
    `;
    box.innerHTML = html;
}

/* ===========================
      PROFILE / LOGIN / REGISTER
=========================== */
function showProfile() {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const reg = document.getElementById("register-section");
    const login = document.getElementById("login-section");
    const userSec = document.getElementById("user-section");
    if (!user) {
        reg.style.display = "block";
        login.style.display = "none";
        userSec.style.display = "none";
    } else {
        reg.style.display = "none";
        login.style.display = "none";
        userSec.style.display = "block";
        document.getElementById("user-name").innerText = "Привет, " + user.login;
        document.getElementById("user-balance").innerText = user.balance;
    }
}

function registerUser() {
    const login = document.getElementById("reg-login").value;
    const password = document.getElementById("reg-password").value;
    if (!login || !password) return alert("Заполните все поля!");
    const user = { login, password, balance: 1000 };
    localStorage.setItem("user", JSON.stringify(user));
    alert("Регистрация успешна!");
    showProfile();
}

function loginUser() {
    const login = document.getElementById("login-login").value;
    const password = document.getElementById("login-password").value;
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return alert("Сначала зарегистрируйтесь!");
    if (login === user.login && password === user.password) {
        alert("Вход успешен!");
        showProfile();
    } else alert("Неверный логин или пароль!");
}

function logoutUser() {
    localStorage.removeItem("user");
    showProfile();
}
