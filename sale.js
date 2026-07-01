document.addEventListener("DOMContentLoaded", () => {
    // 1. 초기 상태 셋팅: 본문을 가리기 위해 body에 클래스 추가
    document.body.classList.add('intro-running');

    // 2. 인트로 요소들에 CSS 애니메이션 클래스 부여 (즉시 실행)
    document.getElementById('main-text').classList.add('anim-bounce');
    document.getElementById('free-text').classList.add('anim-slide-left');
    document.getElementById('all-text').classList.add('anim-slide-right');
    document.getElementById('plane-icon').classList.add('anim-fly');
    
    document.querySelector('.c1').classList.add('anim-confetti-1');
    document.querySelector('.c2').classList.add('anim-confetti-2');
    document.querySelector('.c3').classList.add('anim-confetti-3');

    // 3. 타이머를 이용한 씬(Scene) 전환
    // 인트로 애니메이션이 끝날 즈음(약 2.5초 후) 오버레이를 지움
    setTimeout(() => {
        const overlay = document.getElementById('intro-overlay');
        overlay.classList.add('hidden'); // 페이드 아웃 시작

        // 오버레이가 완전히 투명해진 후(0.6초 뒤) 본문 등장 처리
        setTimeout(() => {
            overlay.style.display = 'none'; // 완전히 제거
            
            // 본문 보이기 처리
            document.body.classList.remove('intro-running');
            document.body.classList.add('intro-done');

            // 본문 각 영역 슬라이드 등장 애니메이션 추가
            const header = document.querySelector('header');
            const main = document.querySelector('main');
            const footer = document.querySelector('footer');

            header.classList.add('fade-up-header');
            main.classList.add('fade-up-main');
            footer.classList.add('fade-up-footer');

            // 마지막으로 헤더 배경색 변경 효과
            setTimeout(() => {
                header.classList.add('bg-pink');
            }, 800);

        }, 600); 

    }, 2500); // 2.5초 대기

    
    const confettiContainer = document.querySelector(".confetti");
    for(let i=0; i<20; i++) {
        const span = document.createElement("span");
        span.innerHTML = ["✨", "🎉", "🎈", "💖"][Math.floor(Math.random()*4)];
        span.style.left = "50%";
        span.className = "anim-confetti-heavy"; // 새 CSS 애니메이션 적용
        confettiContainer.appendChild(span);
    }

    
});