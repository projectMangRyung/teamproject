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