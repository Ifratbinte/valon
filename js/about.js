(function ($) {
	"use strict";

    jQuery(document).ready(function($){


        $(".embed-responsive iframe").addClass("embed-responsive-item");
        $(".carousel-inner .item:first-child").addClass("active");
        
        $('[data-toggle="tooltip"]').tooltip();

		//team_carousel//
		$(".team_carousel").owlCarousel({
			items:3,
			loop:true,
			navText:false,
			dots:true,
		})

        


    });


    jQuery(window).load(function(){

        
    });


}(jQuery));	





$("#cssmenu").menumaker({
    title: "Menu"
});
