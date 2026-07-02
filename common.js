// 페이지 로드 후 자동으로 애니메이션 실행
const move = document.querySelectorAll(".move")
let observer = new IntersectionObserver(function(entries){
    entries.forEach(function(item){
        if(item.isIntersecting){
            item.target.classList.add("on")
        }
    })
}, {
    threshold: 0.8
})

move.forEach(function(item){
    observer.observe(item)
})
$(function(){
    $(".gnb_products").mouseenter(function(){
        $(".snb").addClass("on")
    })
    $(".gnb_products").mouseleave(function(){
        $(".snb").removeClass("on")
    })
})

// ==========================================
// like 아이콘 기능 고도화 (트렌디 팝업 & 다시 돌리기)
// ==========================================

// 1. 아이콘 호버 시 나타나는 미니 안내 박스 생성
const randomBox = document.createElement("div");
randomBox.className = "randomBox";
randomBox.innerHTML = `<p>클릭하면 귀여운 강아지가 펑! 🐾</p>`;

// 2. 쁘띠빠띠 팝업 레이아웃 구조 생성 (정적 뼈대 구성으로 최적화)
const randomDog = document.createElement("div");
randomDog.className = "randomDog";
randomDog.innerHTML = `
    <div class="randomDogCard">
        <h3 class="popupTitle">🐶 오늘의 강아지 🐶</h3>
        <div class="randomDogImg">
            <img src="" alt="randomDog" id="dogImgElement" style="display:none;"/>
            <div class="loadingSpinner">댕댕이 불러오는 중...🐾</div>
        </div>
        <div class="popupButtons">
            <button class="randomDogRefresh">새 친구 소개</button>
            <button class="randomDogClose">그만 볼래요</button>
        </div>
    </div>
`;
document.body.appendChild(randomDog);

// 3. 최신 유행 스타일에 맞춘 쁘띠빠띠 CSS 스타일 주입
function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}

const trendyPopStyle = `
    /* 미니 호버 박스 기존 유지 및 정돈 */
    .randomBox {
        display : none;
        position : absolute;
        top : 3.5rem;
        right : 0;
        transform : translateX(35%);
        width : 13rem;
        color : #2E5A44;
        background-color : white;
        z-index : 9999;
        border-radius : 0.75rem;
        box-shadow : 0 8px 24px rgba(0, 0, 0, 0.15);
        text-align : center;
        padding : 0.8rem;
        font-size: 0.85rem;
        font-weight: bold;
    }
    
    /* 팝업 전체 오버레이 (글래스모피즘 블러 효과로 트렌디함 UP) */
    .randomDog {
        display : none;
        position : fixed;
        top : 0; left : 0;
        width: 100%; height: 100%;
        background-color : rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        z-index : 10000;
        justify-content: center;
        align-items: center;
    }
    
    /* 활성화 되었을 때 flex로 변경 */
    .randomDog.on {
        display: flex;
    }
    
    /* 펑! 하고 귀엽게 튀어나오는 바운스 카드 애니메이션 */
    .randomDogCard {
        background-color: white;
        border-radius: 2rem;
        box-shadow: 0 20px 50px rgba(46, 90, 68, 0.2);
        padding: 2.2rem;
        width: 25rem;
        text-align: center;
        transform: scale(0.5) translateY(30px);
        opacity: 0;
        transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s;
    }
    
    /* 클래스 on이 붙으면 카드가 펑! 하고 확장됨 */
    .randomDog.on .randomDogCard {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
    
    .popupTitle {
        font-size: 1.25rem;
        font-weight: 800;
        color: #2E5A44;
        margin-bottom: 1.2rem;
        letter-spacing: -0.5px;
    }
    
    /* 이미지 프레임 */
    .randomDogImg {
        width: 100%;
        height: 16rem;
        border-radius: 1.5rem;
        overflow: hidden;
        background: #F5F5F5;
        margin-bottom: 1.5rem;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
    }
    
    .randomDogImg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        animation: fadeIn 0.3s ease-in-out;
    }
    
    /* 로딩 스피너 애니메이션 스타일 */
    .loadingSpinner {
        font-size: 0.95rem;
        font-weight: 700;
        color: #7A827E;
    }
    
    /* 버튼 레이아웃 */
    .popupButtons {
        display: flex;
        gap: 0.6rem;
        width: 100%;
    }
    
    .popupButtons button {
        flex: 1;
        border: none;
        padding: 0.85rem;
        border-radius: 1rem;
        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    
    /* 다시 돌리기 버튼 (메인 포인트 컬러 계열 사용) */
    .randomDogRefresh {
        background-color: #2E5A44;
        color: white;
        box-shadow: 0 4px 12px rgba(46, 90, 68, 0.3);
    }
    
    .randomDogRefresh:hover {
        background-color: #1f3d2e;
        transform: translateY(-2px);
    }
    
    .randomDogRefresh:active {
        transform: translateY(0);
    }
    
    /* 닫기 버튼 */
    .randomDogClose {
        background-color: #EEEEEE;
        color: #5A625E;
    }
    
    .randomDogClose:hover {
        background-color: #E2E2E2;
        transform: translateY(-2px);
    }
    
    .randomDogClose:active {
        transform: translateY(0);
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;
AddStyle(trendyPopStyle);

// 4. 랜덤 강아지 이미지 API 호출 함수 (로딩 최적화 퀄리티 업)
async function getRandomDogImage() {
    const imgEl = document.getElementById("dogImgElement");
    const spinner = document.querySelector(".loadingSpinner");
    
    // 새 이미지를 불러오기 전 이전 이미지를 숨기고 로딩 스피너 작동
    if(imgEl) imgEl.style.display = "none";
    if(spinner) {
        spinner.style.display = "block";
        spinner.innerHTML = "새로운 댕댕이 매칭 중...🐾";
    }
    
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        const imageUrl = data.message;
        
        if(imgEl) {
            imgEl.src = imageUrl;
            // 이미지가 브라우저에 완전히 로드된 시점에 교체하여 깜빡임 방지
            imgEl.onload = () => {
                if(spinner) spinner.style.display = "none";
                imgEl.style.display = "block";
            };
        }
    } catch (error) {
        console.error('Error fetching random dog image:', error);
        if(spinner) spinner.innerHTML = "❌ 댕댕이가 도망쳤어요! 다시 시도해주세요.";
    }
}

// 5. 이벤트 리스너 바인딩
const like = document.querySelector(".login > li:nth-child(3) > a");
if(like) {
    like.appendChild(randomBox);
    
    // 호버 안내박스 제어
    like.addEventListener("mouseenter", function(){
        randomBox.style.display = "block";
    });
    like.addEventListener("mouseleave", function(){
        randomBox.style.display = "none";
    });
    
    // 하트 아이콘 클릭 시 팝업 등장 ("on" 클래스로 애니메이션 핸들링)
    like.addEventListener("click", function(e){
        e.preventDefault(); // a 태그 링크 이동 방지
        randomDog.classList.add("on");
        getRandomDogImage();
    });
}

// 6. 팝업 내부 버튼 이벤트 제어
document.querySelector(".randomDogClose").addEventListener("click", function(){
    randomDog.classList.remove("on");
});

// [요청 반영] 다시 돌리기 버튼 클릭 이벤트 추가! 무한 랜덤 스핀 가능
document.querySelector(".randomDogRefresh").addEventListener("click", function(){
    getRandomDogImage();
});

// 배경 블러 영역 클릭 시에도 자연스럽게 닫히도록 처리
randomDog.addEventListener("click", function(e){
    if(e.target === randomDog) {
        randomDog.classList.remove("on");
    }
});