require('bootstrap');

let Celgenedashboard = function (obj) {
	// alert(1);
	let $ = jQuery;

	$('.celgeneSidebar nav ul li.dividerLink .labelLink').click(function () {
		$(this).toggleClass('active');
		$(this).parents('.dividerLink').find('> ul').slideToggle();
	});

	$('.celgeneSidebar nav ul li.borderLink .labelLink').click(function () {
		$(this).toggleClass('active');
		$(this).parents('.borderLink').find('ul').slideToggle();
	});

	//
	var activePageTxt = $('.tax-specialty .celgeneSidebar .ulDropdown .options li .active').text();
	$('.tax-specialty .celgeneSidebar .ulDropdown .span_select').text(activePageTxt);

	var activePageTxt2 = $('.single-disease-area .celgeneSidebar .ulDropdown .options li .active').text();
	$('.single-disease-area .celgeneSidebar .ulDropdown .span_select').text(activePageTxt2);

	var activePageTxt3 = $('.post-type-archive-molecule .celgeneSidebar .ulDropdown .options li ul li .active').text();
	$('.post-type-archive-molecule .celgeneSidebar .ulDropdown .span_select').text(activePageTxt3);

	var activePageTxt4 = $('.single-molecule .celgeneSidebar .ulDropdown .options li ul li .active').text();
	$('.single-molecule .celgeneSidebar .ulDropdown .span_select').text(activePageTxt4);

	var activePageTxt5 = $('.single-pathways .celgeneSidebar .ulDropdown .options .dividerLink ul li .active').text();
	$('.single-pathways .celgeneSidebar .ulDropdown .span_select').text(activePageTxt5);

	var bmsActivePageTxt = $('.celgeneSidebar .ulDropdown .options li a.active').text();
	$('.celgeneSidebar .ulDropdown .span_select').text(bmsActivePageTxt);

	// function isDesktop() {
    //     return $(window).width() > 1199;
    // }

	// let filterPanel = $('.ulDropdown');
    // let sticky = filterPanel.offset().top - 60;
	// let stickyL = filterPanel.offset().left;
	// let stickyWidth = filterPanel.width();
	// $(window).on('resize', function(){
	// 	if(isDesktop()){
	// 	sticky = filterPanel.offset().top - 60;
	// 	stickyL = filterPanel.offset().left;
	// 	stickyWidth = filterPanel.width();
	// 	}else{
	// 		filterPanel.removeClass('sticky');
    //         filterPanel.removeAttr('style');
	// 	}
	// });
	// window.onscroll = function() {
	// 	if(isDesktop()){
	// 		leftpannelStiky();
	// 	}else{
	// 		filterPanel.removeClass('sticky');
    //         filterPanel.removeAttr('style');
	// 	}
	// }
	// function leftpannelStiky(){
	// 	if (window.pageYOffset > sticky) {
	// 		filterPanel.addClass('sticky');
	// 		filterPanel.css({left: stickyL, width:stickyWidth});
	// 	} else {
    //         filterPanel.removeClass('sticky');
    //         filterPanel.removeAttr('style');
    //     }
	// }
	var bottom = $('.search .content').offset() ? $('.search .content').offset().top - 100 : 0;
	//var bottom = $('.filterBySection').offset().top;

	var filterHt = $('.filterBySection').outerHeight();
	
	if (bottom != 0)
		$(window).scroll(function () {
			var winWidth = $(window).innerWidth;			
			if ($(this).scrollTop() > bottom && winWidth > 768) {

				$('.topSectionBg').addClass('filterAdded');
				if($(window).width() >= 767) {
					$('.search .content').css({'margin-top':filterHt});
				}
			}
			else {
				$('.topSectionBg').removeClass('filterAdded');
				$('.search .content').css({'margin-top':0});
			}


		});

	//
	$('.readMoreParent .readMoreLink').click(function () {
		$(this).toggleClass('active');
		$(this).parents('.readMoreParent').find('.readMoreChild').toggleClass('showAll');
		return false;
	});

	/*
	$(document).click(function () {
		$(".filterSubOption").slideUp(function () {
            $(".filterSubOption").slideUp();
			$('.filterSubOption').removeClass('open');
			$( ".filterOptionParent ul li" ).each(function(index) {
				var html = $(this).find(".filterList").html();
				if(html == ""){
					$(this).find(".filterLink").removeClass("active");
				}
			});

        });
	});
	
	$('.filterSubOption').click(function (e) {
        e.stopPropagation();
    });
	*/

};

module.exports = Celgenedashboard;