/*  공통으로 이용할 함수

        슬라이드 이동 함수
            해당 기능에는 페이지네이션 HTML에 class를 이동하여 현 위치를 마크해야함
        CSS 삽입 함수
*/
//CSS 삽입 함수
function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}
// 팝업 오늘 다시보지 않기
$(function(){
    let today1 = new Date().toLocaleDateString()
    let saveday1 = localStorage.getItem("closeD")

    if(saveday1 !== today1){
        $(".modalBg").css("display", "flex")
    }
    $(".todayClose").click(function(){
        localStorage.setItem("closeD", today1)
        $(".modalBg").hide()
    })

    $(".close").click(function(){
        $(".modalBg").hide()
    })
})
//기본적인 슬라이드 정보 얻어두기
const slidewrap = document.querySelector(".slidewrap");
const slidescnt = document.querySelectorAll(".slide").length;
const slideContainer = document.getElementsByClassName("slides");
let currentSlide = 0;

window.addEventListener("resize", function(){
    goToSlide(currentSlide)
})

/*  페이지네이션 생성 함수
        HTML 삽입
        CSS 삽입 (공통함수 사용)
        페이지네이션 이벤트 등록 (공통함수 이벤트 함수)
*/
// 페이지네이션 생성
function Createpagination(){
    // 1. 삽입 위치를 slidewrap 안에서 service 영역 최상단으로 변경
    const serviceSection = document.querySelector(".service");
    serviceSection.insertAdjacentHTML('afterbegin', `<ul class="pagination"></ul>`);
    const pagination = document.querySelector(".pagination");
    
    // 2. 꼬여있던 for문을 0 인덱스부터 깔끔하게 생성하도록 개선
    let html = "";
    for (let i = 0 ; i < slidescnt; i++){
        if(i === 0) {
            html += `<li class="act"></li>`;
        } else {
            html += `<li></li>`;
        }
    }
    pagination.innerHTML = html;

    // 3. 막대기 CSS 대신 투명 PNG 배경 & 홀짝 로직 추가
    const paginationStyle = `
        .pagination {
            display: flex;
            position: absolute;
            top: 1.7rem; /* .service 상단에서 2rem 만큼 떨어지게 배치 */
            left: 50%;
            transform: translateX(-50%);
            gap: 1.5rem; /* 아이콘 사이 간격 */
            padding: 0;
            margin: 0;
            z-index: 10;
        }
        .pagination li {
            list-style: none;
            width: 60px; /* 준비하신 png 이미지 크기에 맞춰 픽셀을 조절하세요 */
            height: 60px;
            cursor: pointer;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        /* 홀수번째 슬라이드 (1, 3, 5...) - 강아지 */
        .pagination li:nth-child(odd) {
            background-image: url('./img/dog_slide.png');
            opacity: 0.7
        }
        .pagination li:nth-child(odd).act {
            background-image: url('./img/dog_slide2.png');
            transform: scale(1.15) translateY(-4px); /* 활성화 시 살짝 커지며 위로 붕 뜨는 효과 */
            opacity: 1
        }

        /* 짝수번째 슬라이드 (2, 4, 6...) - 고양이 */
        .pagination li:nth-child(even) {
            background-image: url('./img/cat_slide.png');
            opacity: 0.7
        }
        .pagination li:nth-child(even).act {
            background-image: url('./img/cat_slide2.png');
            transform: scale(1.15) translateY(-4px);
            opacity: 1
        }
    `
    AddStyle(paginationStyle);

    // 4. 페이지네이션 클릭 이벤트 (기존 a 태그 삭제에 맞춰 li 요소 자체에 이벤트 부여)
    const paginationlink = document.querySelectorAll(".pagination li");
    paginationlink.forEach((link, index) => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          goToSlide(index);
          startAutoSlide(); // 클릭해서 넘겼을 때 자동 슬라이드 타이머가 꼬이지 않도록 리셋
        });
    });
}
//슬라이드 이동 함수
function goToSlide(index){
    currentSlide = index;
    slideContainer[0].style.transition = 'transform 0.5s ease';
    slideContainer[0].style.transform = `translateX(-${100 * currentSlide}%)`;
	// 추가 부분
    //페이지네이션 Class 부여하기  
    const pagination = document.querySelectorAll(".pagination li");
    for (let i = 0 ; i < pagination.length ; i++){
        if(i === index){
            pagination[i].classList.add("act");
            continue;
        }
        pagination[i].classList.remove("act");
    }
}

/*  버튼 생성 함수
        HTML 삽입
        CSS 삽입 (공통함수 사용)
        버튼 이벤트 등록 (공통함수 이벤트 함수)
*/
// 버튼생성
function Createbtn(){
    //HTML Tag 생성
    slidewrap.innerHTML += `<div class="leftbtn btn"><img src='./img/prev.png' alt='leftBtn'/></div>`;
    slidewrap.innerHTML += `<div class="rightbtn btn"><img src='./img/next.png' alt='rightBtn'/></div>`;
    //CSS 생성
    const BtnStyle = `
        .btn {
            display : flex;
            position : absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 50px;
            height : 50px;
            font-size: 40px;
            cursor: pointer;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(8px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.16);
            transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
            opacity: 0.9;
            z-index: 5;
        }
        .btn:hover {
            transform: translateY(-50%) scale(1.08);
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
            opacity: 1;
        }
        .btn:active {
            transform: translateY(-50%) scale(0.94);
        }
        .leftbtn{
            left : 20px;
            animation: slideInLeft 0.6s ease both;
        }
        .rightbtn{
            right : 20px;
            animation: slideInRight 0.6s ease both;
        }
        .btn img {
            width: 24px;
            height: 24px;
            object-fit: contain;
            transition: transform 0.25s ease;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .btn img {
            animation: idleArrow 1.8s ease-in-out infinite;
        }
        .leftbtn img {
            --arrow-shift: -2px;
            animation-direction: normal;
        }
        .rightbtn img {
            --arrow-shift: 2px;
            animation-direction: normal;
        }
        .btn:hover img {
            transform: scale(1.12) translateX(var(--arrow-shift, 0px));
            animation: none;
        }
        .leftbtn:hover img {
            --arrow-shift: -2px;
        }
        .rightbtn:hover img {
            --arrow-shift: 2px;
        }
        .btn:active img {
            transform: scale(0.92);
            animation: none;
        }
        @keyframes idleArrow {
            0%, 100% {
                transform: translateX(0) rotate(0deg);
            }
            50% {
                transform: translateX(var(--arrow-shift, 0px)) rotate(var(--arrow-rotate, 0deg));
            }
        }
        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateY(-50%) translateX(-12px);
            }
            to {
                opacity: 0.9;
                transform: translateY(-50%) translateX(0);
            }
        }
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateY(-50%) translateX(12px);
            }
            to {
                opacity: 0.9;
                transform: translateY(-50%) translateX(0);
            }
        }
    `
    AddStyle(BtnStyle);
    
     //버튼 이벤트 생성
    const BtnL = document.querySelector(".leftbtn");
    BtnL.addEventListener('click',(event)=>{
        event.preventDefault(); // 기본 앵커 링크 동작을 막습니다.
        const index = (currentSlide-1) >=0 ? currentSlide-1 : slidescnt-1; // 삼항 연산을 통해 페이지 이동 최소 값 제한
        goToSlide(index);
        if(index < 0){
            goToSlide(slidescnt)
        }
    })
    const BtnR = document.querySelector(".rightbtn");
    BtnR.addEventListener("click", function(event) {
    event.preventDefault();

    const index = (currentSlide + 1) < slidescnt ? currentSlide + 1 : 0;
    goToSlide(index);
    startAutoSlide();
});
}
// 자동 슬라이드 + 게이지 직접 제어
const autoSlideDelay = 7500;
let autoSlideTimer = null;


function nextSlide() {
    const nextIndex = (currentSlide + 1) < slidescnt ? currentSlide + 1 : 0;
    goToSlide(nextIndex);
    startAutoSlide();
}

function startAutoSlide() {
    clearTimeout(autoSlideTimer);


    autoSlideTimer = setTimeout(function () {
        nextSlide();
    }, autoSlideDelay);
}

startAutoSlide();

Createpagination();

//웹 브라우저 시작
Createbtn();
async function productload(){
    try{
        let res = await fetch("./json/product.json")
        let product = await res.json()
        let html = ''
        product.forEach(function(item){
            html += `
                    <div class='best_card'>
                        <div class='bestImg'>
                            <img src='${item.src}' alt='${item.title}'/>
                        </div>
                        <p>${item.brand}</p>
                        <h4>${item.name}</h4>
                        <h4>${item.price}</h4>
                        <button>장바구니</button>
                    </div>
                    `
        })
        let bestBox = document.querySelector(".best_box")
        bestBox.innerHTML = html
    }catch(err){
        console.error("에러발생", err)
    }
}

// 전체보기 버튼 클릭 시 높이 자동으로 변경(2026.06.26 최정은)
$(function(){
    $("#show_all").on("click", function(){
        $(".products_best").toggleClass("on");
        $(this).html($(this).html() === "전체 보기" ? "닫기" : "전체 보기");
    });
})

async function userload(){
    try{
        let res = await fetch("./json/user.json")
        let product = await res.json()
        let html = ''
        product.forEach(function(item){
            html += `
                    <div class="review_card">
                        <img src="./img/${item.reviewimg}" alt="reviewimg"/>
                        <ul>
                            <li>${item.product}</li>
                        </ul>
                        <ul>
                            <li>${item.comment}</li>
                        </ul>
                        <ul>
                            <li>${item.petName}</li>
                            <li>${item.userName}</li>
                        </ul>
                        <ul>
                            <li>👍 도움돼요 ${item.likes}</li>
                        </ul>
                    </div>
                    `
        })
        let reviewBox = document.querySelector(".review_box")
        reviewBox.innerHTML = html

        // 슬라이드 초기화
        initReviewSlider();
    }catch(err){
        console.error("에러발생", err)
    }
}

function initReviewSlider() {
    const reviewBox = document.querySelector(".review_box");
    const cards = document.querySelectorAll(".review_card");
    const total = cards.length;
    const visibleCount = 4;
    const dotCount = total - visibleCount + 1;
    let current = 0;
    let startX = 0;
    let isDragging = false;
    let dragOffset = 0;
    let cardWidth = 0;

    // 카드 너비 한 번만 계산
    function updateCardWidth() {
        cardWidth = cards[0].offsetWidth + 24; // gap 1.5rem = 24px
    }
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);

    // dot 생성
    const dotWrap = document.createElement("div");
    dotWrap.className = "review_dots";
    for(let i = 0; i < dotCount; i++){
        const dot = document.createElement("span");
        dot.className = "review_dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goReview(i));
        dotWrap.appendChild(dot);
    }
    reviewBox.parentElement.appendChild(dotWrap);

    function goReview(index) {
        current = index;
        reviewBox.style.transition = "transform 0.4s ease";
        reviewBox.style.transform = `translateX(-${current * cardWidth}px)`;
        document.querySelectorAll(".review_dot").forEach((d, i) => {
            d.classList.toggle("active", i === current);
        });
    }

    // 드래그 이벤트
    reviewBox.addEventListener("mousedown", (e) => {
        startX = e.clientX;
        isDragging = true;
        reviewBox.style.transition = "none";
    });

    reviewBox.addEventListener("mousemove", (e) => {
        if(!isDragging) return;
        dragOffset = e.clientX - startX;
        reviewBox.style.transform = `translateX(${-current * cardWidth + dragOffset}px)`;
    });

    reviewBox.addEventListener("mouseup", (e) => {
        if(!isDragging) return;
        isDragging = false;
        const diff = startX - e.clientX;
        if(diff > 180 && current < dotCount - 1) goReview(current + 1);
        else if(diff < -180 && current > 0) goReview(current - 1);
        else goReview(current);
    });

    reviewBox.addEventListener("mouseleave", () => {
        if(!isDragging) return;
        isDragging = false;
        goReview(current);
    });

    // 터치 이벤트 (모바일)
    reviewBox.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        reviewBox.style.transition = "none";
    });

    reviewBox.addEventListener("touchmove", (e) => {
        dragOffset = e.touches[0].clientX - startX;
        reviewBox.style.transform = `translateX(${-current * cardWidth + dragOffset}px)`;
    });

    reviewBox.addEventListener("touchend", (e) => {
        const diff = startX - e.changedTouches[0].clientX;
        if(diff > 180 && current < dotCount - 1) goReview(current + 1);
        else if(diff < -180 && current > 0) goReview(current - 1);
        else goReview(current);
    });
}

productload()
userload()

// ==================== 팝업 시스템 (사이드 오프셋 토글 방식) ====================
$(function(){
    let today1 = new Date().toLocaleDateString();
    let saveday1 = localStorage.getItem("closeD");

    if(saveday1 !== today1){
        // 페이지 로드 후 0.5초 뒤에 자연스럽고 싱그럽게 아래에서 튕겨 올라옴
        setTimeout(function() {
            $(".modalBg").css("display", "block").addClass("show");
        }, 500);
    }
    
    $(".todayClose").click(function(){
        localStorage.setItem("closeD", today1);
        $(".modalBg").removeClass("show");
    });

    $(".close").click(function(){
        $(".modalBg").removeClass("show");
    });
});

// ==================== 고성능 스크롤 애니메이션 (Intersection Observer) ====================
document.addEventListener("DOMContentLoaded", function () {
    const moveElements = document.querySelectorAll(".move");

    const observerOptions = {
        root: null, 
        rootMargin: "0px 0px -12% 0px", // 화면 하단에 닿기 직전 미리 실행되어 시각적 리듬감 부여
        threshold: 5 
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animated");
                // 원활한 렌더링 성능을 위해 한번 등장한 타겟은 관찰 대상에서 제외
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    moveElements.forEach(element => {
        scrollObserver.observe(element);
    });
});