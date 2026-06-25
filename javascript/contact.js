$(function () {

    /* ====================
       FAQ 아코디언
    ==================== */
    $('.faq-item h3').click(function () {
        $(this).toggleClass('active');
        $(this).next('p').slideToggle(300);
    });

    /* ====================
       TOP 버튼
    ==================== */
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.top-btn').fadeIn();
        } else {
            $('.top-btn').fadeOut();
        }
    });

    $('.top-btn').click(function () {
        $('html, body').animate({ scrollTop: 0 }, 400);
    });

    /* ====================
       localStorage - 문의 임시저장
    ==================== */
    $('[data-key]').each(function () {
        const key = $(this).data('key');
        const saved = localStorage.getItem(key);
        if (saved) $(this).val(saved);
    });

    $('[data-key]').on('input change', function () {
        const key = $(this).data('key');
        localStorage.setItem(key, $(this).val());
    });

    $('#inquiryForm').submit(function (e) {
        e.preventDefault();
        $('[data-key]').each(function () {
            localStorage.removeItem($(this).data('key'));
        });
        alert('접수되었습니다!');
        this.reset();
    });

    /* ====================
       IntersectionObserver - 스크롤 등장
    ==================== */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));

});