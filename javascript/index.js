//기본적인 슬라이드 정보 얻어두기
const slidewrap = document.querySelector(".slidewrap");
const slidescnt = document.querySelectorAll(".slide").length;
const slideContainer = document.getElementsByClassName("slides");
const slideWidth = slidewrap.offsetWidth;
let currentSlide = 0;

/*  공통으로 이용할 함수

        슬라이드 이동 함수
            해당 기능에는 페이지네이션 HTML에 class를 이동하여 현 위치를 마크해야함
        CSS 삽입 함수
*/

//슬라이드 이동 함수
function goToSlide(index){
    currentSlide = index;
    slideContainer[0].style.transition = 'transform 0.5s ease';
    slideContainer[0].style.transform = `translateX(-${slideWidth * currentSlide}px)`;
}

//CSS 삽입 함수
function AddStyle(style){
    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);
}

/*  페이지네이션 생성 함수
        HTML 삽입
        CSS 삽입 (공통함수 사용)
        페이지네이션 이벤트 등록 (공통함수 이벤트 함수)
*/
// 페이지네이션 생성
function Createpagination(){
    //HTML Tag 생성
    slidewrap.innerHTML += `<div class="pagination"></div>`;
    const pagination = document.querySelector(".pagination");
    for (let i = 1 ; i < slidescnt; i++){
        if(i===1){pagination.innerHTML += `<li class="act"></li>`;}
        pagination.innerHTML += `<li></li>`;
    }

    //CSS 생성
    const paginationStyle = `
        .pagination {
            display : flex;
            position : absolute;
            left : 50%;
            transform: translateX(-50%);
            bottom : 8rem;
        }
        .pagination li{
            list-style: none;
            width: 10rem;
            height: 0.3rem;
            background-color:  #1F6F5F;
            opacity: 0.5;
        }
        .pagination .act{
            opacity: 1;
        }
    `
    AddStyle(paginationStyle);

    //페이지네이션 이벤트 생성
    const paginationlink = document.querySelectorAll(".pagination li a");
    paginationlink.forEach((link, index) => {
        link.addEventListener('click', (event) => {
          event.preventDefault(); // 기본 앵커 링크 동작을 막습니다.
          goToSlide(index);
        });
    });
}
//슬라이드 이동 함수
function goToSlide(index){
    currentSlide = index;
    slideContainer[0].style.transition = 'transform 0.5s ease';
    slideContainer[0].style.transform = `translateX(-${slideWidth * currentSlide}px)`;
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
        }
        .leftbtn{
            left : 20px;
        }
        .rightbtn{
            right : 20px;
        }
    `
    AddStyle(BtnStyle);
    
     //버튼 이벤트 생성
    const BtnL = document.querySelector(".leftbtn");
    BtnL.addEventListener('click',(event)=>{
        event.preventDefault(); // 기본 앵커 링크 동작을 막습니다.
        const index = (currentSlide-1) >=0 ? currentSlide-1 : slidescnt-1; // 삼항 연산을 통해 페이지 이동 최소 값 제한
        goToSlide(index);
    })
    const BtnR = document.querySelector(".rightbtn");
    BtnR.addEventListener('click',(event)=>{
        event.preventDefault(); // 기본 앵커 링크 동작을 막습니다.
        const index = (currentSlide+1) < slidescnt ? currentSlide+1 : 0; //삼항 연산을 통해 페이지 이동 최대 값 제한
        goToSlide(index);
    })
}

Createpagination()

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
                            <li>도움돼요 ${item.likes}</li>
                        </ul>
                    </div>
                    `
        })
        let reviewBox = document.querySelector(".review_box")
        reviewBox.innerHTML = html
    }catch(err){
        console.error("에러발생", err)
    }
}
async function randomDog() {
    try{
        let ranimg = await fetch("https://dog.ceo/api/breeds/image/random")
        let dogimg = await ranimg.json()
        let html =  `
                        <img src="${dogimg.message}" alt="random_img"/>
                    `
        console.log(dogimg)
        let randomBox = document.querySelector(".randomImg")
        randomBox.innerHTML = html
    }catch(err){
        console.err("이미지 로드 실패", err)
    }
}
productload()
userload()
randomDog()