$(function () {

    const CART_KEY = 'cart';
    const FREE_DELIVERY = 30000;
    const DELIVERY_FEE = 3000;

    // localStorage 관리
    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    // 장바구니 렌더링
    function renderCart() {
        const cart = getCart();
        $('#cartItems').empty();
        $('#bannerCount').text(cart.length);

        if (cart.length === 0) {
            $('#emptyCart').show();
            $('.cart-list-header').hide();
            updateSummary([]);
            return;
        }

        $('#emptyCart').hide();
        $('.cart-list-header').show();

        cart.forEach((item, index) => {
            $('#cartItems').append(`
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

    // 금액 계산
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

    // 수량 변경
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

    // 개별 삭제
    $(document).on('click', '.delete-btn', function () {
        const cart = getCart();
        cart.splice($(this).data('index'), 1);
        saveCart(cart);
        renderCart();
    });

    // 선택 삭제
    $('#deleteSelected').click(function () {
        const checked = [];
        $('.item-check').each(function (i) {
            if ($(this).is(':checked')) checked.push(i);
        });
        const newCart = getCart().filter((_, i) => !checked.includes(i));
        saveCart(newCart);
        renderCart();
    });

    // 전체 선택
    $('#checkAll').change(function () {
        $('.item-check').prop('checked', $(this).is(':checked'));
    });

    $(document).on('change', '.item-check', syncCheckAll);

    function syncCheckAll() {
        const total = $('.item-check').length;
        const checked = $('.item-check:checked').length;
        $('#checkAll').prop('checked', total > 0 && total === checked);
    }

    // 주문하기 버튼
    $('.order-btn').click(function () {
        const cart = getCart();

        if (cart.length === 0) {
            $('#emptyModal').addClass('show');
            return;
        }

        // 상품 목록 렌더링
        let itemHtml = '';
        cart.forEach(item => {
            itemHtml += `
                <div class="order-item">
                    <img src="${item.src}" alt="${item.name}">
                    <div class="order-item-info">
                        <p>${item.name}</p>
                        <span>${(item.priceNum * item.qty).toLocaleString()}원 / ${item.qty}개</span>
                    </div>
                </div>
            `;
        });
        $('#orderItemList').html(itemHtml);

        // 총 금액
        const total = cart.reduce((sum, item) => sum + item.priceNum * item.qty, 0);
        const fee = total >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
        $('#orderTotalText').text((total + fee).toLocaleString() + '원');

        $('#orderModal').addClass('show');
    });

    // 빈 장바구니 모달 닫기
    $('#emptyClose').click(function () {
        $('#emptyModal').removeClass('show');
    });

    // 주문 취소
    $('#orderCancel').click(function () {
        $('#orderModal').removeClass('show');
    });

    // 주문 확인
    $('#orderConfirm').click(function () {
        $('#orderModal').removeClass('show');
        localStorage.removeItem(CART_KEY);
        renderCart();

        // 체크마크 애니메이션 재실행
        $('.check-circle, .check-mark').css('animation', 'none');
        setTimeout(function () {
            $('.check-circle, .check-mark').css('animation', '');
            $('#completeModal').addClass('show');
        }, 10);
    });

    // 주문 완료 닫기
    $('#completeClose').click(function () {
        $('#completeModal').removeClass('show');
    });

    // TOP 버튼
    $(window).scroll(function () {
        $(this).scrollTop() > 300 ? $('.top-btn').fadeIn() : $('.top-btn').fadeOut();
    });
    $('.top-btn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
    });

    // 스크롤 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));

    // 초기 실행
    renderCart();

});