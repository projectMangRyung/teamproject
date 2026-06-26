// 페이지 로드 후 자동으로 애니메이션 실행
const move = document.querySelectorAll(".move")
let observer = new IntersectionObserver(function(entries){
    entries.forEach(function(item){
        if(item.isIntersecting){
            item.target.classList.add("observe")
        }
    })
},{
    threshold : 0.8
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