let allProducts = [];
let currentPrice = 0;

const urlParams = new URLSearchParams(window.location.search);
let currentCategory = urlParams.get("category") || "전체";

const productBox = document.querySelector(".product_box");
const productSearch = document.querySelector("#product_search");
const searchBtn = document.querySelector("#searchBtn");
const sortSelect = document.querySelector("#sort");

// 상품 불러오기
async function productload() {
  const res = await fetch("./json/product.json");
  allProducts = await res.json();

  allProducts = allProducts.map((item, index) => {
    return {
      ...item,
      date: item.date || `2026-06-${String(30 - (index % 25)).padStart(2, "0")}`,
      review: item.review || Number((4.1 + (index % 9) * 0.1).toFixed(1))
    };
  });

  document.querySelector(".all_search h1").textContent =
    currentCategory === "전체" ? "전체상품" : currentCategory;

  renderProducts();
}

// 상품 렌더링
function renderProducts() {
  const keyword = productSearch.value.trim().toLowerCase();
  const sortValue = sortSelect.value;

  let list = allProducts.filter((item) => {
    const matchCategory =
      currentCategory === "전체" || item.category === currentCategory;

    const matchKeyword =
      item.name.toLowerCase().includes(keyword) ||
      item.brand.toLowerCase().includes(keyword) ||
      item.category.toLowerCase().includes(keyword);

    return matchCategory && matchKeyword;
  });

  if (sortValue === "date") {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (sortValue === "review") {
    list.sort((a, b) => Number(b.review) - Number(a.review));
  }

  if (sortValue === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }

  if (list.length === 0) {
    productBox.innerHTML = `<p class="no_result">검색 결과가 없습니다.</p>`;
    return;
  }

  let html = "";

  list.forEach((item) => {
    html += `
      <div class="product_card" data-index="${allProducts.indexOf(item)}">
        <div class="productImg">
          <img src="${item.src}" alt="${item.name}" />
        </div>
        <p>${item.brand}</p>
        <h4>${item.name}</h4>
        <h4>${item.price}</h4>
        <button class="btn_card_cart">장바구니</button>
      </div>
    `;
  });

  productBox.innerHTML = html;
}

// 검색 실행
function handleSearch(event) {
  if (event) event.preventDefault();
  renderProducts();
}

searchBtn.addEventListener("click", handleSearch);

productSearch.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSearch(e);
  }
});

sortSelect.addEventListener("change", renderProducts);

// 모달 열기
function openModal(index) {
  const item = allProducts[index];
  currentPrice = parseInt(String(item.price).replace(/[^0-9]/g, "")) || 0;

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
  const qty = parseInt(document.getElementById("modalQty").value);
  document.getElementById("modalTotalPrice").textContent =
    (currentPrice * qty).toLocaleString() + "원";
}

// 장바구니 담기
function addToCart(item, qty = 1) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const exist = cart.findIndex((c) => c.name === item.name);

  if (exist !== -1) {
    cart[exist].qty += qty;
  } else {
    cart.push({
      src: item.src,
      name: item.name,
      brand: item.brand,
      priceNum: currentPrice,
      qty: qty
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// 카드 클릭 시 모달 열기
productBox.addEventListener("click", function (e) {
  const card = e.target.closest(".product_card");
  if (!card) return;

  openModal(card.getAttribute("data-index"));
});

// 닫기 버튼
document.querySelector(".modal_close").addEventListener("click", closeModal);

document.getElementById("productModal").addEventListener("click", function (e) {
  if (e.target === this) closeModal();
});

// 수량 버튼
document.querySelector(".qty_btn.minus").addEventListener("click", function () {
  const qty = document.getElementById("modalQty");

  if (parseInt(qty.value) > 1) {
    qty.value--;
    calcTotal();
  }
});

document.querySelector(".qty_btn.plus").addEventListener("click", function () {
  document.getElementById("modalQty").value++;
  calcTotal();
});

// 장바구니 담기 버튼
document.querySelector(".btn_modal_cart").addEventListener("click", function () {
  const index = document.getElementById("productModal").getAttribute("data-index");
  const qty = parseInt(document.getElementById("modalQty").value);

  addToCart(allProducts[index], qty);
  closeModal();

  // 아이콘 애니메이션 재실행
  const icon = document.querySelector(".cart_modal_icon");
  icon.style.animation = "none";
  setTimeout(() => { icon.style.animation = ""; }, 10);

  // 컨페티 생성
  const colors = ["#1F6F5F", "#ffce54", "#ff6b6b", "#4ecdc4", "#ffa07a"];
  const wrap = document.getElementById("confettiWrap");
  wrap.innerHTML = "";

  for (let i = 0; i < 20; i++) {
    const dot = document.createElement("div");
    dot.className = "confetti active";
    dot.style.left = Math.random() * 100 + "%";
    dot.style.background = colors[Math.floor(Math.random() * colors.length)];
    dot.style.animationDelay = Math.random() * 0.3 + "s";
    wrap.appendChild(dot);
  }

  document.getElementById("cartModal").classList.add("show");
});

// 장바구니 모달 - 쇼핑 계속하기
document.getElementById("cartModalClose").addEventListener("click", function () {
  document.getElementById("cartModal").classList.remove("show");
  document.body.style.overflow = "auto";
});

// 장바구니 모달 - 장바구니 보기
document.getElementById("cartModalGo").addEventListener("click", function () {
  window.location.href = "./cart.html";
});

// 바로 구매하기 버튼
document.querySelector(".btn_modal_buy").addEventListener("click", function () {
  const index = document.getElementById("productModal").getAttribute("data-index");
  const qty = parseInt(document.getElementById("modalQty").value);

  addToCart(allProducts[index], qty);
  window.location.href = "./cart.html";
});

// 탑 버튼
window.addEventListener("scroll", function () {
  const topBtn = document.getElementById("topBtn");

  if (window.scrollY > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
});

document.getElementById("topBtn").addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

productload();