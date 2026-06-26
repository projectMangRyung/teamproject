$(function () {

    /* ====================
       상수
    ==================== */
    const CART_KEY = 'cart';
    const FREE_DELIVERY = 30000;
    const DELIVERY_FEE = 3000;

    /* ====================
       localStorage 관리
    ==================== */
    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    /* ====================
       장바구니 렌더링
    ==================== */
    function renderCart() {
        const cart = getCart();
        const $items = $('#cartItems');
        const $empty = $('#emptyCart');

        $items.empty();

        // 배너 상품 수 업데이트
        $('#bannerCount').text(cart.length);

        if (cart.length === 0) {
            $empty.show();
            $('.cart-list-header').hide();
            updateSummary([]);
            return;
        }

        $empty.hide();
        $('.cart-list-header').show();

        // 아이템 HTML 생성
        cart.forEach((item, index) => {
            $items.append(`
                <div class="cart-item" data-index="${index}">
                    <input type="checkbox" class="item-check">
                    <img src="${item.src}" alt="${item.name}">
                    <div class="cart-item-info">
                        <p class="brand">${item.brand}</p>
                        <p class="name">${item.name}</p>
                        <p class="price">${(item.priceNum * item.qty).toLocaleString()}원</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="delete-btn" data-index="${index}">✕</button>
                        <div class="qty-control">
                            <button class="qty-minus" data-index="${index}">−</button>
                            <span>${item.qty}</span>
                            <button class="qty-plus" data-index="${index}">+</button>
                        </div>
                    </div>
                </div>
            `);
        });

        updateSummary(cart);
        syncCheckAll();
    }

    /* ====================
       금액 계산
    ==================== */
    function updateSummary(cart) {
        const total = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
        const fee = cart.length === 0 ? 0 : total >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
        const final = total + fee;

        $('#totalPrice').text(total.toLocaleString() + '원');
        $('#deliveryFee').text(fee === 0 ? '무료' : fee.toLocaleString() + '원');
        $('#finalPrice').text(final.toLocaleString() + '원');

        if (cart.length === 0) {
            $('#freeNotice').text('');
        } else if (total < FREE_DELIVERY) {
            $('#freeNotice').text(`${(FREE_DELIVERY - total).toLocaleString()}원 더 담으면 무료배송!`);
        } else {
            $('#freeNotice').text('무료배송 적용중 🎉');
        }
    }

    /* ====================
       수량 변경
    ==================== */
    $(document).on('click', '.qty-plus', function () {
        const cart = getCart();
        cart[$(this).data('index')].qty++;
        saveCart(cart);
        renderCart();
    });

    $(document).on('click', '.qty-minus', function () {
        const cart = getCart();
        const i = $(this).data('index');
        if (cart[i].qty > 1) {
            cart[i].qty--;
            saveCart(cart);
            renderCart();
        }
    });

    /* ====================
       개별 삭제
    ==================== */
    $(document).on('click', '.delete-btn', function () {
        const cart = getCart();
        cart.splice($(this).data('index'), 1);
        saveCart(cart);
        renderCart();
    });

    /* ====================
       선택 삭제
    ==================== */
    $('#deleteSelected').click(function () {
        const checked = [];
        $('.item-check').each(function (i) {
            if ($(this).is(':checked')) checked.push(i);
        });
        const newCart = getCart().filter((_, i) => !checked.includes(i));
        saveCart(newCart);
        renderCart();
    });

    /* ====================
       전체 선택 / 해제
    ==================== */
    $('#checkAll').change(function () {
        $('.item-check').prop('checked', $(this).is(':checked'));
    });

    $(document).on('change', '.item-check', syncCheckAll);

    function syncCheckAll() {
        const total = $('.item-check').length;
        const checked = $('.item-check:checked').length;
        $('#checkAll').prop('checked', total > 0 && total === checked);
    }

    /* ====================
       주문하기
    ==================== */
    $('.order-btn').click(function () {
        const cart = getCart();
        if (cart.length === 0) {
            alert('장바구니가 비어있어요!');
            return;
        }
        alert('주문이 완료되었습니다! 감사합니다 🐾');
        localStorage.removeItem(CART_KEY);
        renderCart();
    });

    /* ====================
       TOP 버튼
    ==================== */
    $(window).scroll(function () {
        $(this).scrollTop() > 300 ? $('.top-btn').fadeIn() : $('.top-btn').fadeOut();
    });

    $('.top-btn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
    });

    /* ====================
       IntersectionObserver
    ==================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));

    /* ====================
       초기 실행
    ==================== */
    renderCart();

});