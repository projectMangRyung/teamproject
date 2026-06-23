$(function(){
    $(".gnb_products").mouseenter(function(){
        $(".snb").addClass("on")
    })
    $(".gnb_products").mouseleave(function(){
        $(".snb").removeClass("on")
    })
})