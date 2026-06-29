let allProducts = [];
let currentPrice = 0;

// URL에서 카테고리 파라미터 읽기
let urlParams = new URLSearchParams(window.location.search);
let currentCategory = urlParams.get("category") || "전체";

// 상품 불러오기
async function productload() {
    let res = await fetch("./json/product.json");
    allProducts = await res.json();

    // 페이지 제목 변경
    document.querySelector(".all_search h1").textContent = currentCategory === "전체" ? "전체상품" : currentCategory;

    renderProducts(currentCategory);
}

// 상품 렌더링
function renderProducts(category) {
    let list = category === "전체" ? allProducts : allProducts.filter(item => item.category === category);
    let html = '';

    list.forEach(function(item, index) {
        html += `
            <div class='product_card' data-index='${allProducts.indexOf(item)}'>
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
}

// 모달 열기
function openModal(index) {
    let item = allProducts[index];
    currentPrice = parseInt(String(item.price).replace(/[^0-9]/g, '')) || 0;

    document.getElementById("modalImg").src = item.src;
    document.getElementById("modalBrand").textContent = item.brand;
    document.getElementById("modalName").textContent = item.name;
    document.getElementById("modalPrice").textContent = item.price;
    document.getElementById("modalQty").value = 1;
    document.getElementById("productModal").setAttribute("data-index", index);

    calcTotal();
    document.getElementById("productModal").classList.add("show");
    document.body.style.overflow = "hidden";
}

// 모달 닫기
function closeModal() {
    document.getElementById("productModal").classList.remove("show");
    document.body.style.overflow = "auto";
}

// 총 금액 계산
function calcTotal() {
    let qty = parseInt(document.getElementById("modalQty").value);
    document.getElementById("modalTotalPrice").textContent = (currentPrice * qty).toLocaleString() + "원";
}

// 장바구니 담기
function addToCart(item, qty = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let exist = cart.findIndex(c => c.name === item.name);

    if (exist !== -1) {
        cart[exist].qty += qty;
    } else {
        cart.push({ src: item.src, name: item.name, brand: item.brand, priceNum: currentPrice, qty: qty });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

// 카드 클릭 → 모달 열기
document.querySelector(".product_box").addEventListener("click", function(e) {
    let card = e.target.closest(".product_card");
    if (!card) return;
    openModal(card.getAttribute("data-index"));
});

// 닫기 버튼
document.querySelector(".modal_close").addEventListener("click", closeModal);
document.getElementById("productModal").addEventListener("click", function(e) {
    if (e.target === this) closeModal();
});

// 수량 버튼
document.querySelector(".qty_btn.minus").addEventListener("click", function() {
    let qty = document.getElementById("modalQty");
    if (parseInt(qty.value) > 1) { qty.value--; calcTotal(); }
});
document.querySelector(".qty_btn.plus").addEventListener("click", function() {
    document.getElementById("modalQty").value++;
    calcTotal();
});

// 장바구니 담기 버튼
document.querySelector(".btn_modal_cart").addEventListener("click", function() {
    let index = document.getElementById("productModal").getAttribute("data-index");
    let qty = parseInt(document.getElementById("modalQty").value);
    addToCart(allProducts[index], qty);
    closeModal();
    alert("장바구니에 담겼습니다!");
});

// 바로 구매하기 버튼
document.querySelector(".btn_modal_buy").addEventListener("click", function() {
    let index = document.getElementById("productModal").getAttribute("data-index");
    let qty = parseInt(document.getElementById("modalQty").value);
    addToCart(allProducts[index], qty);
    window.location.href = "./cart.html";
});

// 탑버튼
window.addEventListener("scroll", function() {
    let topBtn = document.getElementById("topBtn");
    if (window.scrollY > 1000) {
        topBtn.style.display = "block";
    } else {
        topBtn.style.display = "none";
    }
});

document.getElementById("topBtn").addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

productload();