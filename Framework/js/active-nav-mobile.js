$(function() {
     var actNav = window.location.pathname;
     $(".active-nav ul li a, .active-nav div a").each(function(){
         if($(this).attr("href") == actNav || $(this).attr("href") == '' )
         $(this).addClass("act-nav");
    })
});




