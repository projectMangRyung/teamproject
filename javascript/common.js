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

// like 아이콘 기능 추가
// 아이콘 호버 시 나타나는 박스 생성
const randomBox = document.createElement("div")
const randomDog = document.createElement("div")
randomBox.className = "randomBox"
randomDog.className = "randomDog"
let innerRandomBox = ''
innerRandomBox = `
    <p>강아지 이미지가 랜덤으로 나타납니다</p>
`
//CSS 생성
function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}
const randomBoxStyle = `
    .randomBox {
        display : none;
        position : absolute;
        top : 3rem;
        right : 0;
        transform : translateX(50%);
        width : 12rem;
        height : 8rem;
        color : black;
        background-color : white;
        z-index : 9999;
        border-radius : 1rem;
        box-shadow : 0 0 10px rgba(0, 0, 0, 0.3);
        text-align : center;
        padding : 2rem;
    }
    .randomDog{
        display : none;
        position : fixed;
        top : 50%;
        left : 50%;
        transform : translate(-50%, -50%);
        width : 20rem;
        height : 20rem;
        background-color : white;
        z-index : 9999;
        border-radius : 1rem;
        box-shadow : 0 0 10px rgba(0, 0, 0, 0.3);
        overflow : hidden;
    }
    .randomDogImg{
        width : 100%;
        height : 100%;
        display : flex;
        justify-content : center;
        align-items : center;
        padding : 1rem;
        overflow : hidden;
    }
    .randomDogImg img{
        width : 100%;
        height : 100%;
        object-fit : cover;
    }
    .randomDogClose{
        position : absolute;
        top : 0;
        right : 0;
        padding : 0.5rem 1rem;
        background-color : #1F6F5F;
        color : white;
    }
`
AddStyle(randomBoxStyle);


// 마우스 커서 애니메이션
const pawCursor = document.createElement("div");
pawCursor.className = "paw_cursor";
document.body.appendChild(pawCursor);

const trailElements = [];
const trailCount = 3;
for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement("div");
    trail.className = "paw_cursor_trail";
    document.body.appendChild(trail);
    trailElements.push(trail);
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;
let trailX = mouseX;
let trailY = mouseY;
let isCursorVisible = true;
let cursorEnabled = true;
let isHeaderCursorActive = false;
let trailTick = 0;
let cursorScale = 1;
let cursorTargetScale = 1;
let cursorRotation = 0;
let cursorTargetRotation = 0;
let lastMouseX = mouseX;
let lastMouseY = mouseY;
const trailHistory = Array.from({ length: trailCount }, () => ({ x: mouseX, y: mouseY }));

function hideCustomCursor() {
    isCursorVisible = false;
    isHeaderCursorActive = false;
    pawCursor.style.opacity = '0';
    trailElements.forEach((trail) => {
        trail.style.opacity = '0';
    });
    document.body.style.cursor = 'default';
}

window.addEventListener('intro:closed', hideCustomCursor);

function updateCursorAnimation() {
    if (!cursorEnabled || !isHeaderCursorActive) return;
    cursorX = mouseX;
    cursorY = mouseY;

    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const velocity = Math.min(1.25, Math.hypot(dx, dy) / 16);

    cursorTargetScale = 1 + velocity * 0.04;
    cursorTargetRotation = Math.max(-8, Math.min(8, dx * 0.05));

    cursorScale += (cursorTargetScale - cursorScale) * 0.2;
    cursorRotation += (cursorTargetRotation - cursorRotation) * 0.2;

    trailX += (mouseX - trailX) * 0.24;
    trailY += (mouseY - trailY) * 0.24;

    if (trailTick % 2 === 0) {
        trailHistory.unshift({ x: trailX, y: trailY });
        trailHistory.length = trailCount;
    }
    trailTick += 1;

    pawCursor.style.top = `${cursorY}px`;
    pawCursor.style.left = `${cursorX}px`;
    pawCursor.style.transform = `translate(-50%, -50%) scale(${cursorScale}) rotate(${cursorRotation}deg)`;

    trailElements.forEach((trail, index) => {
        const point = trailHistory[index] || { x: trailX, y: trailY };
        const opacity = Math.max(0.02, 0.18 - index * 0.03);
        const scale = Math.max(0.55, 1 - index * 0.08);
        trail.style.top = `${point.y}px`;
        trail.style.left = `${point.x}px`;
        trail.style.opacity = opacity.toString();
        trail.style.transform = `translate(-50%, -50%) scale(${scale * cursorScale}) rotate(${cursorRotation}deg)`;
    });

    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

setInterval(() => {
    if (isCursorVisible) {
        updateCursorAnimation();
    }
}, 25);

window.addEventListener("mousemove", (event) => {
    if (!cursorEnabled) return;
    mouseX = event.clientX;
    mouseY = event.clientY;

    const insideHeader = event.target instanceof Element && event.target.closest("header");
    if (insideHeader) {
        isCursorVisible = true;
        isHeaderCursorActive = true;
        pawCursor.style.opacity = "1";
    } else {
        hideCustomCursor();
    }
});

window.addEventListener("mouseleave", () => {
    if (!cursorEnabled) return;
    hideCustomCursor();
});

window.addEventListener("mouseenter", () => {
    if (!cursorEnabled) return;
    isCursorVisible = true;
});

window.addEventListener("mousedown", () => {
    if (!cursorEnabled) return;
    cursorTargetScale = 0.86;
});

window.addEventListener("mouseup", () => {
    if (!cursorEnabled) return;
    cursorTargetScale = 1;
});

const pawCursorStyle = `
    body {
        cursor: default;
    }
    header,
    .headerInner,
    .logo > a,
    .gnb > li > a,
    .login > li > a,
    .snb > li > a,
    .login > li > a > img {
        cursor: none;
    }
    .paw_cursor {
        background-image: url('./img/black_paw.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: fixed;
        width: 2rem;
        height: 2rem;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 50%;
        opacity: 1;
        transition: opacity 0.3s ease;
        filter: drop-shadow(0 6px 10px rgba(31, 111, 95, 0.25));
    }
    .paw_cursor_trail {
        background-image: url('./img/black_paw.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        position: fixed;
        width: 2rem;
        height: 2rem;
        pointer-events: none;
        z-index: 99998;
        transform: translate(-50%, -50%);
        opacity: 0;
        filter: blur(0.8px);
        mix-blend-mode: multiply;
    }
`
AddStyle(pawCursorStyle);
updateCursorAnimation();


// 랜덤 강아지 이미지 가져오기
async function getRandomDogImage() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        const imageUrl = data.message;
        innerRandomDog = `
            <div class="randomDogImg">
                <img src="${imageUrl}" alt="randomDog"/>
            </div>
            <button class="randomDogClose">닫기</button>
        `
        randomDog.innerHTML = innerRandomDog
        const randomDogClose = document.querySelector(".randomDog > button")
        randomDogClose.addEventListener("click", function(){
            randomDog.style.display = "none"
        })
    } catch (error) {
        console.error('Error fetching random dog image:', error);
    }
}
randomBox.innerHTML = innerRandomBox

document.body.appendChild(randomDog)
const like = document.querySelector(".login > li:nth-child(3) > a")
like.appendChild(randomBox)
like.addEventListener("mouseenter", function(){
    randomBox.style.display = "block"
})
like.addEventListener("mouseleave", function(){
    randomBox.style.display = "none"
})
like.addEventListener("click", function(){
    randomDog.style.display = "block"
    getRandomDogImage()
})

// ========== 모바일 햄버거 메뉴 (2026.07.01) ==========
$(function () {
    $("#hamburgerBtn").on("click", function () {
        $(this).toggleClass("active");
        $(".gnb").toggleClass("active");
        $(".login").toggleClass("active");
        $("body").toggleClass("no-scroll");
    });

    // 메뉴 클릭 시 자동 닫힘
    $(".gnb a, .login a").on("click", function () {
        $("#hamburgerBtn").removeClass("active");
        $(".gnb, .login").removeClass("active");
        $("body").removeClass("no-scroll");
    });
});