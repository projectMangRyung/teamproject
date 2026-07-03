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
    body { cursor: default; }
    header, .headerInner, .logo > a, .gnb > li > a,
    .login > li > a, .snb > li > a, .login > li > a > img {
        cursor: none;
    }
    .paw_cursor {
        background-image: url('./img/black_paw.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: fixed;
        width: 2rem; height: 2rem;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -50%);
        top: 50%; left: 50%;
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
        width: 2rem; height: 2rem;
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

// ==========================================
// like 아이콘 기능
// ==========================================
const randomBox = document.createElement("div");
randomBox.className = "randomBox";
randomBox.innerHTML = `<p>클릭하면 귀여운 강아지가 펑! 🐾</p>`;

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

function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}

const trendyPopStyle = `
    .randomBox {
        display: none; position: absolute;
        top: 3.5rem; right: 0;
        transform: translateX(35%);
        width: 13rem; color: #2E5A44;
        background-color: white; z-index: 9999;
        border-radius: 0.75rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        text-align: center; padding: 0.8rem;
        font-size: 0.85rem; font-weight: bold;
    }
    .randomDog {
        display: none; position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.4);
        backdrop-filter: blur(8px);
        z-index: 10000;
        justify-content: center; align-items: center;
    }
    .randomDog.on { display: flex; }
    .randomDogCard {
        background-color: white; border-radius: 2rem;
        box-shadow: 0 20px 50px rgba(46,90,68,0.2);
        padding: 2.2rem; width: 25rem; text-align: center;
        transform: scale(0.5) translateY(30px); opacity: 0;
        transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275), opacity 0.3s;
    }
    .randomDog.on .randomDogCard { transform: scale(1) translateY(0); opacity: 1; }
    .popupTitle { font-size: 1.25rem; font-weight: 800; color: #2E5A44; margin-bottom: 1.2rem; }
    .randomDogImg {
        width: 100%; height: 16rem; border-radius: 1.5rem;
        overflow: hidden; background: #F5F5F5; margin-bottom: 1.5rem;
        display: flex; justify-content: center; align-items: center;
    }
    .randomDogImg img { width: 100%; height: 100%; object-fit: cover; animation: fadeIn 0.3s ease-in-out; }
    .loadingSpinner { font-size: 0.95rem; font-weight: 700; color: #7A827E; }
    .popupButtons { display: flex; gap: 0.6rem; width: 100%; }
    .popupButtons button {
        flex: 1; border: none; padding: 0.85rem;
        border-radius: 1rem; font-size: 0.95rem;
        font-weight: 700; cursor: pointer;
        transition: all 0.2s;
    }
    .randomDogRefresh { background-color: #2E5A44; color: white; }
    .randomDogRefresh:hover { background-color: #1f3d2e; transform: translateY(-2px); }
    .randomDogClose { background-color: #EEEEEE; color: #5A625E; }
    .randomDogClose:hover { background-color: #E2E2E2; transform: translateY(-2px); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* ===== 헤더 로그인 영역 한 줄 고정 ===== */
    .login {
        white-space: nowrap;
        flex-wrap: nowrap !important;
        align-items: center;
    }
    .login > li > a {
        white-space: nowrap;
        font-size: 0.85rem;
    }
    .mypage_link {
        font-weight: 700;
    }
`;
AddStyle(trendyPopStyle);

async function getRandomDogImage() {
    const imgEl = document.getElementById("dogImgElement");
    const spinner = document.querySelector(".loadingSpinner");
    if(imgEl) imgEl.style.display = "none";
    if(spinner) {
        spinner.style.display = "block";
        spinner.innerHTML = "새로운 댕댕이 매칭 중...🐾";
    }
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        if(imgEl) {
            imgEl.src = data.message;
            imgEl.onload = () => {
                if(spinner) spinner.style.display = "none";
                imgEl.style.display = "block";
            };
        }
    } catch (error) {
        if(spinner) spinner.innerHTML = "❌ 댕댕이가 도망쳤어요!";
    }
}

const like = document.querySelector(".login > li:nth-child(3) > a");
if(like) {
    like.appendChild(randomBox);
    like.addEventListener("mouseenter", () => randomBox.style.display = "block");
    like.addEventListener("mouseleave", () => randomBox.style.display = "none");
    like.addEventListener("click", function(e){
        e.preventDefault();
        randomDog.classList.add("on");
        getRandomDogImage();
    });
}

document.querySelector(".randomDogClose").addEventListener("click", () => randomDog.classList.remove("on"));
document.querySelector(".randomDogRefresh").addEventListener("click", getRandomDogImage);
randomDog.addEventListener("click", (e) => { if(e.target === randomDog) randomDog.classList.remove("on"); });

// ========== 모바일 햄버거 메뉴 ==========
$(function () {
    $("#hamburgerBtn").on("click", function () {
        $(this).toggleClass("active");
        $(".gnb").toggleClass("active");
        $(".login").toggleClass("active");
        $("body").toggleClass("no-scroll");
    });
    $(".gnb a, .login a").on("click", function () {
        $("#hamburgerBtn").removeClass("active");
        $(".gnb, .login").removeClass("active");
        $("body").removeClass("no-scroll");
    });
});

// 학생용 포트폴리오
const footerText = document.createElement("div");
footerText.className = "footerText";
footerText.innerHTML = `<b><p>학생용 포트폴리오입니다</p></b>`;
document.querySelector("footer").appendChild(footerText);

// ========== 로그인 상태 헤더 반영 ==========
function updateHeaderLoginState() {
    const currentUser =
        JSON.parse(localStorage.getItem("currentUser")) ||
        JSON.parse(sessionStorage.getItem("currentUser"));

    const loginLi = document.querySelector(".login > li:nth-child(1)");
    const joinLi = document.querySelector(".login > li:nth-child(2)");

    if (!loginLi || !joinLi) return;

    if (currentUser) {
        // 로그인 상태
        loginLi.innerHTML = `<a href="#" id="logoutBtn">로그아웃</a>`;
        joinLi.innerHTML = `<a href="./cart.html" class="mypage_link">👤 ${currentUser.name}님</a>`;

        document.getElementById("logoutBtn").addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("currentUser");
            sessionStorage.removeItem("currentUser");
            alert("로그아웃 됐습니다.");
            location.reload();
        });
    } else {
        // 비로그인 상태
        loginLi.innerHTML = `<a href="./login.html">로그인</a>`;
        joinLi.innerHTML = `<a href="./join.html">회원가입</a>`;
    }
}

updateHeaderLoginState();