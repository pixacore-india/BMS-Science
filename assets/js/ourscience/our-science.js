let OurScience = function(){
	let $ = jQuery;
    $('.ourScience-header.show-search').on('click', function(){
		// alert(1);
		// if($(window).width() >= 992){
		// 	$('.search-panel').toggleClass('hidden');
		// 	$('.bmsSearchBar .bmsSearchInput').focus();
		// 	$(this).hide();
		// }else{
		// 	$('.mobile-search-panel').addClass('open');
		// }
		if($(window).width() < 992){
			$('.mobile-search-panel').addClass('open');
			$('body').css('cssText', 'overflow-y: hidden;');
		} 
	});
	// $(document).mouseup(function(e) {
	// 	var container = $('.search-panel');

	// 	// if the target of the click isn't the container nor a descendant of the container
	// 	if (!container.is(e.target) && container.has(e.target).length === 0) 
	// 	{
	// 		// container.hide();
	// 		container.addClass('hidden');
	// 		$('header.sub-header .show-search').show();
	// 	}
	// });
	// $('.mobile-search-panel .search-header .cancel-box .cancel-link').on('click', function(){
	$(document).on('click', '.mobile-search-panel .search-header .cancel-box .cancel-link', function(){
		$('.mobile-search-panel').removeClass('open');
		$('body').css('cssText', 'overflow-y: auto;');
	});
	$('.aria').on('click', function(){
		$('.therapeutic-areas-details').addClass('active');
		$('.aria').removeClass('active');
		$(this).toggleClass('active');
		$('.celgen-therapeutic-arias').addClass('opened');
	});
	let mobileSearch = $('.mobileOnly').clone();
	let DesktopSearch = $('.desktopOnly').clone();
	if($(window).width() >= 992){
		$('.mobileOnly').remove();
		$('.desktopOnly').addClass('active');
	}else{
		$('.desktopOnly').remove();
		$('.mobileOnly').addClass('active');
	}
	$(window).resize(function(event){
		if($(window).width() >= 992){
			$('.mobileOnly').remove();
			if($('.desktopOnly').length <= 0){
				$('header.sub-header .navbar .collapse.navbar-collapse').append(DesktopSearch);
				$('.desktopOnly').addClass('active');
			}
		}else{
			$('.desktopOnly').remove();
			if($('.mobileOnly').length <= 0){
				$('.mobile-search-panel').append(mobileSearch);
				$('.mobileOnly').addClass('active');
			}
		}
	});
};
module.exports = OurScience;