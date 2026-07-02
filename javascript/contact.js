$(function () {

    /* ====================
       초기 화면 진입 애니메이션 (순차적 시간차 노출)
    ==================== */
    // 1단계. 고양이 캐릭터 등장 (가장 먼저)
    setTimeout(function() {
        $('.cat-wrap').addClass('on');
    }, 150);

    // 2단계. 큰 제목 글씨 "무엇을 도와드릴까요?" 등장
    setTimeout(function() {
        $('.ani-text-1').addClass('on');
    }, 750);

    // 3단계. 하단 설명 멘트 등장
    setTimeout(function() {
        $('.ani-text-2').addClass('on');
    }, 1350);


    /* ====================
       스크롤 인터랙션 (동그라미 배경 차오름 & 카드 개별 등장/실종)
    ==================== */
    $(window).on('scroll', function () {
        let scrollTop = $(window).scrollTop();
        let windowHeight = $(window).height();

        /* 1. 동그라미 모양 배경 차오르기 연산 */
        let bgSection = $('.scroll-bg-section');
        if (bgSection.length > 0) {
            let targetTop = bgSection.offset().top;
            
            // 화면 하단에 구역이 닿기 시작할 때부터 완전히 들어올 때까지 기준점 생성
            let startTrigger = targetTop - windowHeight;
            let endTrigger = targetTop - windowHeight * 0.2;

            if (scrollTop > startTrigger) {
                let progress = (scrollTop - startTrigger) / (endTrigger - startTrigger);
                if (progress < 0) progress = 0;
                if (progress > 1) progress = 1;

                // 진행도에 맞춰 지름을 0%에서 150%까지 동적으로 변화시킴
                let circleRadius = progress * 150;
                bgSection.css('--circle-radius', circleRadius + '%');
            } else {
                bgSection.css('--circle-radius', '0%');
            }
        }

        /* 2. 상담 카드 하나씩 순차적으로 차오르기 (올리면 다시 사라짐) */
        $('.contact-card-wrap').each(function () {
            let cardTop = $(this).offset().top;
            
            // 스크롤이 내려가서 카드가 화면 하단 82% 지점에 걸치면 노출
            if (scrollTop + windowHeight * 0.82 > cardTop) {
                $(this).addClass('visible');
            } else {
                // 스크롤을 다시 올리면 클래스를 지워 원래대로 되돌림
                $(this).removeClass('visible');
            }
        });

        /* 3. 자주묻는 질문 ~ 문의 영역 스르륵 노출 */
        let supportSection = $('.support-section');
        if (supportSection.length > 0) {
            let supportTop = supportSection.offset().top;
            if (scrollTop + windowHeight * 0.85 > supportTop) {
                supportSection.addClass('visible');
            } else {
                supportSection.removeClass('visible');
            }
        }
    });


    /* ====================
       기존 기능 보존 (FAQ, TOP버튼, 임시저장)
    ==================== */
    // FAQ 아코디언 기능
    $('.faq-item h3').click(function () {
        $(this).toggleClass('active');
        $(this).next('p').slideToggle(300);
    });

    // TOP 버튼 처리
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

    // localStorage - 데이터 싱크 및 자동 복구
    $('[data-key]').each(function () {
        const key = $(this).data('key');
        const saved = localStorage.getItem(key);
        if (saved) $(this).val(saved);
    });

    $('[data-key]').on('input change', function () {
        const key = $(this).data('key');
        localStorage.setItem(key, $(this).val());
    });

    // 폼 서브밋 처리
    $('#inquiryForm').submit(function (e) {
        e.preventDefault();
        $('[data-key]').each(function () {
            localStorage.removeItem($(this).data('key'));
        });
        alert('접수되었습니다!');
        this.reset();
    });

});