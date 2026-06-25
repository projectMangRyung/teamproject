$(function () {

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