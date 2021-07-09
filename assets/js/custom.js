var app;

app = {
	
	init : function(){

		console.log("This is init function.");

		this.cacheElements();
		
		var $this = this
		
		this.dom.pillsLink.on('click', function (e) {
			e.stopPropagation();
			$this.filterPillClick($(this));
		});
		
		this.dom.filterPillsDropdown.on('click', function (e) {
			e.stopPropagation();
		});
		
		this.dom.document.on('click', function () {
			$this.documentClick();
		});
		
		this.dom.mobileFilterPill.on('click', function () {
			$this.mobFilterPillClick($(this));
		});
		
		this.dom.mobileCancelFilter.on('click', function () {
			$this.mobFilterCancel($(this));
		});
		
		this.dom.backToTop.on('click', function () {
			$this.backToTopClick();
		});

		$.fn.isInViewport = function () {
			var elementTop = $(this).offset().top;
			var elementBottom = elementTop + $(this).outerHeight();
			var viewportTop = $(window).scrollTop();
			var viewportBottom = viewportTop + $(window).height();
			return elementBottom > viewportTop && elementTop < viewportBottom;
		};

		this.dom.window.scroll(function () {
			if ($(this).scrollTop() > 270) {
			  $('#backToTop').show();
			} else {
			  $('#backToTop').hide();
			}

			if ($("footer").isInViewport()) {
			  $('#backToTop').addClass('footerVisible');
			} else {
			  $('#backToTop').removeClass('footerVisible');
			}
		});
		
		this.dom.window.resize(function () {
			if ($(window).width() < 768) {
			  return;
			}

			$('.filterByBx .filterMobPill').click(function () {
			  $(this).parents('.filterByBx').find('.filterPills').slideDown();
			});
		});

	},

	cacheElements: function cacheElements() {
		this.dom = {
			window: $(window),
			document: $(document),
			body: $('body'),
			pillsLink: $('.filterPills .pillsLink'),
			filterPillsDropdown: $('.filterPillsDropdown'),
			mobileFilterPill: $('.filterByBx .filterMobPill'),
			mobileCancelFilter: $('.filterByBx .mobButton .mobileFilter'),
			backToTop: $('#backToTop'),
			pipelineTab: $(".pipelineTab"),
			scrollPosTop: 0
		};
	},

	filterPillClick: function filterPillClick(ele) {
		if (ele.hasClass('active')) {
		  this.dom.pillsLink.removeClass('active');
		  this.dom.pillsLink.parents('.filterPills').find('.filterPillsDropdown').slideUp();
		} else {
		  this.dom.pillsLink.removeClass('active');
		  this.dom.pillsLink.parents('.filterPills').find('.filterPillsDropdown').slideUp();
		  ele.addClass('active');
		  ele.parents('li').find('.filterPillsDropdown').slideDown();
		}

		return false;
	  },
	  documentClick: function documentClick() {
		var $this = this;

		if ($(window).width() >= 768) {
		  $(".filterPillsDropdown").slideUp('slow', function () {
			// $(".filterPillsDropdown").slideUp('slow');
			$this.dom.pillsLink.removeClass('active');
		  });
		}
	  },
	  mobFilterPillClick: function mobFilterPillClick(ele) {
		this.scrollPosTop = $(document).scrollTop();
		$("html, body").css("overflow", "hidden");
		$("body").css({
		  "position": "fixed",
		  "top": -this.scrollPosTop
		});
		ele.parents('.filterByBx').find('.filterPills').slideDown();
	  },
	  mobFilterCancel: function mobFilterCancel(ele) {
		$("html, body").css("overflow", "scroll");
		$("body").css({
		  "position": "relative",
		  "top": ""
		});
		$('html, body').animate({
		  scrollTop: this.scrollPosTop
		}, 0);
		ele.parents('.filterByBx').find('.filterPills').slideUp();
	  },
	  backToTopClick: function backToTopClick() {
		$('html, body').animate({
		  scrollTop: '0px'
		}, 1000);
	  }

}

app.init();


$(document).ready(function(){

	// init Isotope
	var $container = $('.cardContainer').isotope({
		itemSelector: '.card',
        filter: '*',
        resize: true,
        containerStyle: {
          position: 'relative'
        },
        layoutMode: 'fitRows'
	});

	$('.tab-thumb li a').on('shown.bs.tab', function(){
		$('.tab-pane.active .filterPillsSelected .output').html("");
		$('.tab-pane.active .filterPills').find("input[type='checkbox']").prop("checked", false);
		
		var $container = $('.cardContainer').isotope({
		itemSelector: '.card',
        filter: '*',
        resize: true,
        containerStyle: {
          position: 'relative'
        },
        layoutMode: 'fitRows'
	});
	});

	//var $output = $('.tab-pane.active .filterPillsSelected .output');

	// filter with selects and checkboxes

	$('.tab-pane').on('change', '.filterPills label input', function() {
		// map input values to an array
		var inclusives = [];
		// inclusive filters from checkboxes
		$('.tab-pane.active .filterPills label input').each( function( i, elem ) {
			// if checkbox, use value if checked
			if ( elem.checked ) {
				inclusives.push( elem.value );
			}
		});

		var filterValue = inclusives.length ? inclusives.join(', ') : '*';
	
		$('.tab-pane.active .filterPillsSelected .output').html("");
		for (var i = 0; i < inclusives.length; i++) {
			var value = inclusives[i];
			var textValue = $('.tab-pane.active .filterPills').find("input[value='".concat(value, "']")).parent().find(".textValue").text();
			var buttons = $("<a value=\"".concat(value, "\" class=\"removeFilter ").concat(value, " \">").concat(textValue, "</a>"));
			$('.tab-pane.active .filterPillsSelected .output').append(buttons);
		}

		$container.isotope({ filter: filterValue });

	});


	$(document).on("click", ".removeFilter", function () {
        $(this).remove();
        var removeItemArray = $(this).attr("value");
        $('.tab-pane.active .filterPills').find("input[value=\"".concat(removeItemArray, "\"]")).prop("checked", false);
		
		var inclusives = [];

		if ($('.tab-pane.active .filterPillsSelected a').length){
			var filterUpdatedValue = $('.tab-pane.active .filterPillsSelected a').attr( "value" );
			inclusives.push( filterUpdatedValue );
			var filterValue = inclusives.length ? inclusives.join(', ') : '*';
		}

		if ( inclusives.length ) {
			$container.isotope({ filter: filterValue })
			
		}else {
			$container.isotope({ filter: '*' })
		}

		
    });

	function clearFilter(){
		$('.tab-pane.active .filterPillsSelected .output').html("");
		$('.tab-pane.active .filterPills').find("input[type='checkbox']").prop("checked", false);
		$container.isotope({ filter: '*' })
	};
	  
	$(document).on("click", ".clearAllLink", function () {
		clearFilter();
	});
	

});

