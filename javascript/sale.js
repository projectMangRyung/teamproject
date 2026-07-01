document.addEventListener("DOMContentLoaded", () => {
    // 1. 초기 상태 셋팅: 본문을 가리기 위해 body에 클래스 추가
    document.body.classList.add('intro-running');

    // 2. 인트로 요소들에 CSS 애니메이션 클래스 부여 (텍스트 & 비행기)
    document.getElementById('main-text').classList.add('anim-bounce');
    document.getElementById('free-text').classList.add('anim-slide-left');
    document.getElementById('all-text').classList.add('anim-slide-right');
    document.getElementById('plane-icon').classList.add('anim-fly');
    
    // 3. 다이나믹 폭죽 파티클 대량 생성 (화려하게 터지도록)
    const confettiContainer = document.getElementById("confetti-container");
    const emojis = ["✨", "🎉", "🎈", "💖", "🌸", "🎊", "⭐", "🛍️"];
    const particleCount = 20;// 폭죽 개수 대폭 증가

    for(let i = 0; i < particleCount; i++) {
        const span = document.createElement("span");
        span.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
        span.className = "anim-confetti-particle";
        
        // CSS 변수를 사용해 각기 다른 랜덤 궤적과 속도로 튕겨나가도록 설정
        const tx = (Math.random() - 0.5) * 1500; // 가로 반경을 크게
        const ty = (Math.random() - 0.7) * 600; // 위로 더 많이 솟구치게
        const rot = Math.random() * 720;
        const scale = Math.random() * 3.5 + 0.8; // 크기 다양화
        const delay = Math.random() * 1.5; // 터지는 타이밍을 조금씩 엇갈리게
        const duration = Math.random() * 1.2 + 1.2; // 지속 시간

        span.style.setProperty('--tx', `${tx}px`);
        span.style.setProperty('--ty', `${ty}px`);
        span.style.setProperty('--rot', `${rot}deg`);
        span.style.setProperty('--scale', scale);
        
        // 무한 반복 애니메이션 (화면이 사라질 때까지 팡팡 터짐)
        span.style.animation = `confettiBurst ${duration}s ease-out ${delay}s infinite`;
        confettiContainer.appendChild(span);
    }

    // 4. 타이머를 이용한 씬(Scene) 전환 (약 2.8초 후 오버레이 제거)
    setTimeout(() => {
        const overlay = document.getElementById('intro-overlay');
        overlay.classList.add('hidden'); // 페이드 아웃 시작

        // 오버레이가 완전히 투명해진 후 본문 등장 처리
        setTimeout(() => {
            overlay.style.display = 'none'; 
            
            document.body.classList.remove('intro-running');
            document.body.classList.add('intro-done');

            const header = document.querySelector('header');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');

            header.classList.add('fade-up-header');
            footer.classList.add('fade-up-footer');

            // 헤더 배경색 변경 효과
            setTimeout(() => {
                header.classList.add('bg-pink');
            }, 800);

        }, 600); 

    }, 2800); 


    // =====================================================
    // 스크롤 애니메이션 (IntersectionObserver)
    // =====================================================

    // 1. 카테고리 도미노
    const catItems = document.querySelectorAll('.cat-item');
    const catObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = document.querySelectorAll('.cat-item');
                items.forEach((item, i) => {
                    setTimeout(() => {
                        item.classList.add('is-visible');
                    }, i * 90); 
                });
                catObserver.disconnect(); 
            }
        });
    }, { threshold: 0.15 });

    const catSection = document.querySelector('.sale-categories');
    if (catSection) catObserver.observe(catSection);

    // 섹션 타이틀
    const sectionTitles = document.querySelectorAll(
        '.sale-categories-sec .section-title, .todays-deal-sec .section-title'
    );
    const titleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                titleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    sectionTitles.forEach(el => titleObserver.observe(el));

    // 2. 오늘의 특가
    const dealHeader = document.querySelector('.todays-deal-sec .deal-header');
    const dealGrid   = document.querySelector('.deal-grid');

    const dealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (dealHeader) dealHeader.classList.add('is-visible');
                if (dealGrid)   dealGrid.classList.add('is-visible');
                dealObserver.disconnect();
            }
        });
    }, { threshold: 0.12 });

    const dealSec = document.querySelector('.todays-deal-sec');
    if (dealSec) dealObserver.observe(dealSec);

    // 3. LUCKY CLAW MACHINE
    const machineTitle = document.querySelector('.machine-title');
    const clawMachine  = document.querySelector('.claw-machine');

    const clawObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (machineTitle) machineTitle.classList.add('is-visible');
                if (clawMachine)  clawMachine.classList.add('is-visible');
                clawObserver.disconnect();
            }
        });
    }, { threshold: 0.15 });

    const clawSec = document.querySelector('.sale-event-sec');
    if (clawSec) clawObserver.observe(clawSec);

    // 4. 이벤트 배너 이미지
    const eventBanner = document.querySelector('.long-event-image-wrap');
    if (eventBanner) {
        const bannerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    bannerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        bannerObserver.observe(eventBanner);
    }
    // =====================================================
    // 랜덤 쿠폰 배너 로직 (로컬스토리지 활용 발급완료 처리)
    // =====================================================
    const smallBtns = document.querySelectorAll('.small-btn');
    const largeBtn = document.getElementById('btn-coupon-all');

    // 공통 알림 함수
    function showCouponAlert() {
        alert("쿠폰이 지급되었습니다! 보관함을 확인해주세요.");
    }

    // 1. 페이지 로드 시 기존에 발급받았는지 상태 확인
    function checkCouponState() {
        let allIssued = true;
        
        // 개별 쿠폰 확인
        smallBtns.forEach((btn, index) => {
            if (localStorage.getItem(`event_coupon_${index}`) === 'issued') {
                btn.classList.add('hidden-coupon');
            } else {
                allIssued = false; // 하나라도 발급 안 받은게 있으면 false
            }
        });

        // 전체 쿠폰 버튼 숨김 판단 (전체 버튼을 눌렀었거나, 개별 4개를 다 눌렀을 경우)
        if (allIssued || localStorage.getItem('event_coupon_all') === 'issued') {
            if(largeBtn) largeBtn.classList.add('hidden-coupon');
            // 전체 발급을 눌렀던 경우라면 낱개도 다 가려줍니다.
            smallBtns.forEach(btn => btn.classList.add('hidden-coupon'));
        }
    }

    // 초기 상태 체크 실행
    checkCouponState();

    // 2. 개별 쿠폰 클릭 이벤트
    smallBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            // 해당 쿠폰 이미지 숨기기
            this.classList.add('hidden-coupon');
            // 로컬스토리지에 저장 (새로고침해도 숨겨지게)
            localStorage.setItem(`event_coupon_${index}`, 'issued');
            
            showCouponAlert();

            // 4개를 다 받았는지 체크해서 큰 버튼도 자동으로 숨김
            let allHidden = true;
            smallBtns.forEach(b => {
                if (!b.classList.contains('hidden-coupon')) {
                    allHidden = false;
                }
            });

            if (allHidden && largeBtn) {
                largeBtn.classList.add('hidden-coupon');
                localStorage.setItem('event_coupon_all', 'issued');
            }
        });
    });

    // 3. 전체 쿠폰 발급 클릭 이벤트
    if (largeBtn) {
        largeBtn.addEventListener('click', function() {
            // 본인 숨기고 상태 저장
            this.classList.add('hidden-coupon');
            localStorage.setItem('event_coupon_all', 'issued');

            // 작은 쿠폰 4개도 다 숨기고 상태 저장
            smallBtns.forEach((btn, index) => {
                btn.classList.add('hidden-coupon');
                localStorage.setItem(`event_coupon_${index}`, 'issued');
            });

            showCouponAlert();
        });
    }
});

// TOP 버튼 스크롤 감지 로직
const topBtn = document.getElementById('keyring-top-btn');
const categorySec = document.querySelector('.sale-categories-sec');

window.addEventListener('scroll', () => {
    if (categorySec && topBtn) {
        // 카테고리 섹션의 실제 페이지 내 상단 위치 계산
        const categoryOffset = categorySec.getBoundingClientRect().top + window.scrollY;
        
        // 현재 스크롤이 카테고리 섹션 근처(살짝 위쪽)에 도달했는지 확인
        // -200은 화면에 카테고리가 보일 즈음 미리 버튼을 띄우기 위한 여유값입니다.
        if (window.scrollY >= categoryOffset - 200) { 
            topBtn.classList.add('show-btn');
        } else {
            topBtn.classList.remove('show-btn');
        }
    }
});