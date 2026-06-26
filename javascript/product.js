let allProducts = []; // 불러온 상품 전체 데이터를 담을 전역 변수
let currentPrice = 0;  // 현재 선택된 상품의 숫자 단가 저장

async function productload(){
    try{
        let res = await fetch("./json/product.json")
        allProducts = await res.json()
        let html = ''
        
        // 반복문에서 index를 활용하여 data-index 속성 부여
        allProducts.forEach(function(item, index){
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
                    `
        })
        let productBox = document.querySelector(".product_box")
        productBox.innerHTML = html

        // 상품 로드가 끝난 후 모달 관련 이벤트 초기화 실행
        initModalEvents();

    }catch(err){
        console.error("에러발생", err)
    }
}

function initModalEvents() {
    const productBox = document.querySelector(".product_box");
    const modal = document.getElementById("productModal");
    const modalClose = document.querySelector(".modal_close");
    
    // 모달 내부 엘리먼트들
    const modalImg = document.getElementById("modalImg");
    const modalBrand = document.getElementById("modalBrand");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalQty = document.getElementById("modalQty");
    const modalTotalPrice = document.getElementById("modalTotalPrice");
    
    const btnMinus = document.querySelector(".qty_btn.minus");
    const btnPlus = document.querySelector(".qty_btn.plus");

    productBox.addEventListener("click", function(e) {
        const card = e.target.closest(".product_card");
        if (!card) return;

        if (e.target.classList.contains("btn_card_cart")) {
            alert("선택하신 상품이 장바구니에 담겼습니다.");
            return;
        }

        const index = card.getAttribute("data-index");
        const product = allProducts[index];

        if(product) {
            modalImg.src = product.src;
            modalImg.alt = product.name;
            modalBrand.textContent = product.brand;
            modalName.textContent = product.name;
            modalPrice.textContent = typeof product.price === 'number' ? product.price.toLocaleString() + '원' : product.price;

            
            const priceStr = String(product.price);
            currentPrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 0;

            modalQty.value = 1;
            updateTotalPrice();

            modal.classList.add("show");
            document.body.style.overflow = "hidden"; 
        }
    });

    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove("show");
        document.body.style.overflow = "auto"; 
    }

    btnMinus.addEventListener("click", function() {
        let qty = parseInt(modalQty.value);
        if (qty > 1) {
            modalQty.value = qty - 1;
            updateTotalPrice();
        }
    });

    btnPlus.addEventListener("click", function() {
        let qty = parseInt(modalQty.value);
        modalQty.value = qty + 1;
        updateTotalPrice();
    });

    function updateTotalPrice() {
        let qty = parseInt(modalQty.value);
        let total = currentPrice * qty;
        modalTotalPrice.textContent = total.toLocaleString() + "원";
    }
}

productload();