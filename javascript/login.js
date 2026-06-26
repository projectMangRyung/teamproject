$(function(){
    $(".login_select").on("click", function(){
        $(this).addClass("selected")
        $(".join_select").removeClass("selected")
        $(".login_container").addClass("on")
        $(".join_container").removeClass("on")
    })
    $(".join_select").on("click", function(){
        $(this).addClass("selected")
        $(".login_select").removeClass("selected")
        $(".join_container").addClass("on")
        $(".login_container").removeClass("on")
    })
})