let allProducts = [];
let currentPrice = 0;

async function productload() {
    try {
        let res = await fetch("./json/product.json");
        allProducts = await res.json();
        let html = '';

        allProducts.forEach(function (item, index) {
            html += `
                <div class='product_card' data-index='${index}'>
                    <div class='productImg'>
                        <img src='${item.src}' alt='${item.name}'/>
                    </div>
                    <p>${item.brand}</p>
                    <h4>${item.name}</h4>
                    <h4>${item.price}</h4>
                    <button class="btn_card_cart">장바구니</button>
                </div>
            `;
        });

        document.querySelector(".product_box").innerHTML = html;
        initModalEvents();

    } catch (err) {
        console.error("에러발생", err);
    }
}

function initModalEvents() {
    const productBox = document.querySelector(".product_box");
    const modal = document.getElementById("productModal");
    const modalClose = document.querySelector(".modal_close");

    const modalImg = document.getElementById("modalImg");
    const modalBrand = document.getElementById("modalBrand");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalQty = document.getElementById("modalQty");
    const modalTotalPrice = document.getElementById("modalTotalPrice");

    const btnMinus = document.querySelector(".qty_btn.minus");
    const btnPlus = document.querySelector(".qty_btn.plus");

    /* ====================
       카드 클릭
    ==================== */
    productBox.addEventListener("click", function (e) {
        const card = e.target.closest(".product_card");
        if (!card) return;

        const index = card.getAttribute("data-index");
        const product = allProducts[index];

        if (e.target.classList.contains("btn_card_cart")) {
            addToCart(product);
            return;
        }

        if (product) {
            modalImg.src = product.src;
            modalImg.alt = product.name;
            modalBrand.textContent = product.brand;
            modalName.textContent = product.name;
            modalPrice.textContent = typeof product.price === 'number'
                ? product.price.toLocaleString() + '원'
                : product.price;

            currentPrice = parseInt(String(product.price).replace(/[^0-9]/g, '')) || 0;
            modalQty.value = 1;
            updateTotalPrice();

            modal.setAttribute("data-index", index);
            modal.classList.add("show");
            document.body.style.overflow = "hidden";
        }
    });

    /* ====================
       모달 닫기
    ==================== */
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        modal.classList.remove("show");
        document.body.style.overflow = "auto";
    }

    /* ====================
       수량 변경
    ==================== */
    btnMinus.addEventListener("click", function () {
        let qty = parseInt(modalQty.value);
        if (qty > 1) {
            modalQty.value = qty - 1;
            updateTotalPrice();
        }
    });

    btnPlus.addEventListener("click", function () {
        modalQty.value = parseInt(modalQty.value) + 1;
        updateTotalPrice();
    });

    function updateTotalPrice() {
        let qty = parseInt(modalQty.value);
        modalTotalPrice.textContent = (currentPrice * qty).toLocaleString() + "원";
    }

    /* ====================
       모달 장바구니 담기
    ==================== */
    document.querySelector(".btn_modal_cart").addEventListener("click", function () {
        const index = modal.getAttribute("data-index");
        const product = allProducts[index];
        const qty = parseInt(modalQty.value);
        for (let i = 0; i < qty; i++) addToCart(product);
        window.location.href = "./cart.html";
    });

    /* ====================
       바로 구매하기
    ==================== */
    document.querySelector(".btn_modal_buy").addEventListener("click", function () {
        const index = modal.getAttribute("data-index");
        const product = allProducts[index];
        const qty = parseInt(modalQty.value);
        for (let i = 0; i < qty; i++) addToCart(product);
        window.location.href = "./cart.html";
    });
}

/* ====================
   장바구니 담기
==================== */
function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const exist = cart.findIndex(c => c.title === item.title);

    if (exist !== -1) {
        cart[exist].qty++;
    } else {
        cart.push({
            src: item.src,
            name: item.name,
            brand: item.brand,
            title: item.title,
            priceNum: parseInt(String(item.price).replace(/[^0-9]/g, '')),
            qty: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

productload();