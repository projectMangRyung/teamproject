$(function () {
    const leafItems = document.querySelectorAll('.leaf-item');

    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;

        leafItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const startPos = windowHeight * 0.85; 
            const endPos = windowHeight * 0.35;  
            
            let progress = (startPos - rect.top) / (startPos - endPos);
            progress = Math.max(0, Math.min(1, progress));

            // 1. 줄기 자라나기 (0 ~ 0.4 구간)
            const stem = item.querySelector('.stem');
            let stemProgress = Math.min(progress - 0, 1);
            stem.style.transform = `scaleX(${stemProgress})`;
            stem.style.opacity = stemProgress;

            // 2. 잎사귀 커지기 (0.3 ~ 1 구간)
            const imageBox = item.querySelector('.leaf-image-box');
            let leafProgress = Math.max(0, (progress - 0.3) / 0.7);
            imageBox.style.transform = `scale(${leafProgress})`;
            imageBox.style.opacity = leafProgress;

            // 3. 텍스트 등장 (완전히 자라난 후)
            const infoBox = item.querySelector('.value-info');
            if (progress >= 0.95) {
                infoBox.classList.add('show');
            } else {
                infoBox.classList.remove('show');
            }
        });
    });
    window.dispatchEvent(new Event('scroll'));
});

$(function () {
    // (이전 잎사귀 애니메이션 로직은 그대로 유지)

    /* ====================
       브랜드 연혁 스크롤 애니메이션 (순차 노래방 업데이트)
    ==================== */
    const historySection = document.querySelector('.brand-history');
    const historySteps = document.querySelectorAll('.history-step');

    if (historySection && historySteps.length > 0) {
        window.addEventListener('scroll', () => {
            const rect = historySection.getBoundingClientRect();
            const triggerPoint = window.innerHeight * 0.25; 
            
            let progress = (triggerPoint - rect.top) / (rect.height - window.innerHeight);
            progress = Math.max(0, Math.min(1, progress)); 

            const stepCount = historySteps.length;
            const stepProgress = 1 / stepCount; 

            historySteps.forEach((step, index) => {
                const stepStart = index * stepProgress;
                const stepEnd = (index + 1) * stepProgress;

                if (progress >= stepStart && progress < stepEnd) {
                    step.classList.add('active');
                    
                    let localProgress = (progress - stepStart) / stepProgress;

                    // 1. 투명도 (스르륵 나타나고 사라짐)
                    let opacity = 1;
                    if (localProgress < 0.15) {
                        opacity = localProgress / 0.15; // 등장 구간
                    } else if (localProgress > 0.85) {
                        opacity = (1 - localProgress) / 0.15; // 퇴장 구간
                    }
                    step.style.opacity = opacity;

                    // 2. 노래방 텍스트 효과 (타이틀 먼저 -> 본문 나중에)
                    // 전체 텍스트 진행 구간을 0 ~ 1로 정규화
                    let textProgress = (localProgress - 0.15) / 0.6;
                    textProgress = Math.max(0, Math.min(1, textProgress));
                    
                    // 타이틀 진행률: 전체 텍스트 구간의 앞 30% 동안 완성
                    let titleProgress = Math.min(1, textProgress / 0.3);
                    
                    // 본문 진행률: 타이틀이 끝난 뒤 나머지 70% 동안 완성
                    let descProgress = Math.max(0, (textProgress - 0.3) / 0.7);

                    const titleBgPos = 100 - (titleProgress * 100); 
                    const descBgPos = 100 - (descProgress * 100); 

                    const titleEl = step.querySelector('.karaoke-title');
                    const descEl = step.querySelector('.karaoke-desc');

                    if (titleEl) titleEl.style.backgroundPosition = `${titleBgPos}% 0`;
                    if (descEl) descEl.style.backgroundPosition = `${descBgPos}% 0`;

                } else {
                    step.classList.remove('active');
                    step.style.opacity = 0;
                }
            });
        });
        window.dispatchEvent(new Event('scroll'));
    }
});
$(function () {
    /* ====================
       연혁 요약 클릭 시 스크롤 이동 및 등장 애니메이션
    ==================== */
    const summaryItems = document.querySelectorAll('.summary-item');
    const historySection = document.querySelector('.brand-history');
    const historySummary = document.querySelector('.history-summary');

    // 1. 스크롤을 내리다 요약 섹션이 보이면 스르륵 등장
    if (historySummary) {
        window.addEventListener('scroll', () => {
            const rect = historySummary.getBoundingClientRect();
            // 화면의 80% 지점에 도달하면 애니메이션 클래스 추가
            if (rect.top < window.innerHeight * 0.8) {
                historySummary.classList.add('show');
            }
        });
    }

    // 2. 작은 이미지(요약 아이템) 클릭 시 해당 연혁으로 스크롤 이동
    summaryItems.forEach((item) => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-index'));
            const stepCount = document.querySelectorAll('.history-step').length;
            
            if (historySection && stepCount > 0) {
                // 각 스텝이 중앙에 완벽히 오도록 진행률 계산 (0.125, 0.375, 0.625, 0.875)
                const targetProgress = (index + 0.5) / stepCount;
                
                // 해당 진행률에 맞는 실제 문서 상의 Y 스크롤 위치 계산
                const sectionTop = historySection.offsetTop;
                const scrollableHeight = historySection.offsetHeight - window.innerHeight;
                const targetScrollY = sectionTop + (scrollableHeight * targetProgress);

                // 부드럽게 스크롤 이동
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            }
        });
    });
});