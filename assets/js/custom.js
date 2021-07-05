require("bootstrap");
require("bootstrapSlider");
require("bxSlider");
require("easyAutoComplete");
let LocationFilter = require("./filters/location");

const { URL, URLSearchParams } = require("@lvchengbin/url");
let API = require("./api");
let UTILITY = require("./utility");
const ClientOAuth2 = require("client-oauth2");
let searchTermType = "all";
var customJS = function () {
	//figure out a better way of doing this
	let $ = jQuery;
	const api = new API();
	// Global Header Scroll move to header js
	if ($(window).scrollTop() >= 28) {
		$("header").addClass("headerBg");
		$('header.sub-header').addClass('shrink');
	} else {
		$('header.sub-header').removeClass('shrink');
		$("header").removeClass("headerBg");
	}

	const headerSearch = new LocationFilter({
		element: $(".headerSearch"),
		callee: "header",
	});

	const searchFormHeader = $("#js-search-header");
	const bmsCurrentLocation = searchFormHeader.find("#bms_current_location");
	const locationGeo = searchFormHeader.find("#location-geo");
	searchFormHeader.on("submit", function () {
		//console.log(locationGeo.val());
		if (locationGeo.val()) {
			$(bmsCurrentLocation).removeAttr("disabled");
		}
	});

	$(window).scroll(function () {
		if ($(window).scrollTop() >= 28) {
			$('header.sub-header').addClass('shrink');
			$("header").addClass("headerBg");
			$(".goToTop").addClass("show");
		} else {
			$('header.sub-header').removeClass('shrink');
			$("header").removeClass("headerBg");
			$(".goToTop").removeClass("show");
		}
	});

	//
	var fixedCls = "header";
	var oldSSB = $.fn.modal.Constructor.prototype.setScrollbar;
	$.fn.modal.Constructor.prototype.setScrollbar = function () {
		oldSSB.apply(this);
		if (this.bodyIsOverflowing && this.scrollbarWidth)
			$(fixedCls).css("padding-right", this.scrollbarWidth);
	};

	var oldRSB = $.fn.modal.Constructor.prototype.resetScrollbar;
	$.fn.modal.Constructor.prototype.resetScrollbar = function () {
		oldRSB.apply(this);
		$(fixedCls).css("padding-right", "");
	};

	$(
		".single-pathways .celgeneSidebar nav ul li.dividerLink .labelLink"
	).addClass("active");

	//@todo: check whether this is still relevant.
	$(".sortBarSection .switchBx .btn-toggle").click(function (e) {
		let specialtyOff =
			$(e.target.parentElement).find("button.active").text() === "OFF" ? 1 : 0;
		let userSpecialty = $(this).attr("data-user-specialty");

		if (specialtyOff) {
			UTILITY.updateQueryString(location.href, "filter_conditions", "");
		} else {
			UTILITY.updateQueryString(
				location.href,
				"filter_conditions",
				userSpecialty
			);
		}

		location.reload();
	});

	if ($(document).height() > $(window).height()) {
		$("body").addClass("verticalScroll");
	} else {
		$("body").removeClass("verticalScroll");
	}

	$(".locationListBx .showMoreLocation").click(function () {
		$(this).toggleClass("showList");
		$(this)
			.find("strong")
			.html(
				$(this).text() == "Hide Study Locations"
					? "Show Study Locations"
					: "Hide Study Locations"
			);
		$(this)
			.parents(".locationListBx")
			.find(".showMoreLocationList")
			.slideToggle();
		return false;
	});

	$(".locationDropItems").click(function () {
		$(this).toggleClass("active");
		$(this).parents(".inputTxt2").find(".filterSubOption").slideToggle();
		return false;
	});

	if (window.location.href.match("crohns-disease")) {
		$("body").addClass("crohns-disease");
	}

	// Global Link Function
	// Was Commented out on 7th October 2019 as suggested by Janice.
	$(document).on("click", "a", function (e) {
		if (!$(this).hasClass("btn-continue")) {
			let href = $(this).attr("href");
			if (href) {
				if (href.indexOf("http") == 0) {
					if (
						href.indexOf("bolderscience") < 0 &&
						href.indexOf(location.hostname) < 0 &&
						href.indexOf("celgene") < 0 &&
						href.indexOf("bms") < 0 &&
						href.indexOf("bmsscience") &&
						href.indexOf("immunooncologyhcp") < 0
					) {
						e.preventDefault();
						$("#interstialPopup").modal("show");
						$("#interstialPopup .btn-continue").attr("href", href);
					}
				}
			}
		} else {
			$("#interstialPopup").modal("hide");
		}
	});
	// Closing interstialPopup and interstialPopup2 after click on continue button
	$(".btn-continue").click(function () {
		$("#interstialPopup").modal("hide");
	});
	//eGlobal Link Function end
	// end Global Header Scroll move to header js

	$(".filterBySection .clearSaveBox .redButtonForm").click(function () {
		$(".saveTrialPopup")
			.removeClass("saveTrialClick")
			.addClass("savedSearchClick");
	});

	$(
		".resultContainer .resultItemsContainer .resultTrial .redButtonStyle"
	).click(function () {
		$(".saveTrialPopup")
			.removeClass("savedSearchClick")
			.addClass("saveTrialClick");
	});

	$(".backLinkBlue, .backLink").click((e) => {
		e.preventDefault();
		location.assign(
			document.referrer || "http://" + window.location.hostname + "/?s="
		);
	});

	$(".masterlegends .mobileLegends .mobileDropdown").click(function () {
		if (
			!$(this)
				.parents(".mobileLegends")
				.find(".customDropdown")
				.hasClass("open")
		) {
			$(".masterlegends .mobileLegends .mobileDropdown").removeClass("active");
			$(".customDropdown").removeClass("open").slideUp();
			$(this)
				.parents(".mobileLegends")
				.find(".customDropdown")
				.addClass("open")
				.slideDown();
			$(this).addClass("active");
		} else {
			$(".masterlegends .mobileLegends .mobileDropdown").removeClass("active");
			$(this)
				.parents(".mobileLegends")
				.find(".customDropdown")
				.removeClass("open")
				.slideUp();
		}
		return false;
	});

	$(".mobileLegends").on("click", "label", function (e) {
		if (!e.target.previousElementSibling.disabled) {
			if (!$(this).hasClass("addedFilter")) {
				$(this).html(`${$(this).html()}<span class="closeIcon"></span>`);
				$(this).clone().appendTo(".activeFiltersPanel");
				$(this).addClass("addedFilter");
				$(this).removeClass('ga-select-filter');
			} else {
				$(this).removeClass("addedFilter");
				$(this).addClass('ga-select-filter');
				removeDom(
					`.activeFiltersPanel label:contains(${e.target.innerText})`,
					this
				);
				$(this).find(".closeIcon").remove();
			}
		}

		if ($(".addedFilter").length) {
			$(".searchButtonStyle").css("display", "inline-block");
			$(".resetFiltersLink").css("display", "inline-block");
		} else {
			$(".searchButtonStyle").css("display", "none");
			$(".resetFiltersLink").css("display", "none");
		}
	});

	//const chartInfo = $(`${$('body').attr('class').split('')[0]} .chartInfo`).clone();

	$(".activeFiltersPanel").on("click", "span", function (e) {
		removeDom(this.parentElement, this);
		$(
			`.mobileLegends label:contains(${e.delegateTarget.innerText})`
		).removeClass("addedFilter");
	});

	const removeDom = (elementQuery) => {
		$(elementQuery).hide();
	};

	// $('#canvas-holder').on('click', '.resetFiltersLink', function (e) {
	//     const checkboxes = $('.mobileLegends').find('.js-label-filter:checked');
	//     const addedFilters = $('#canvas-holder .addedFilter');
	//     for (let i = 0; i < addedFilters.length; i++) {
	//         //addedFilters[i].click();
	//          checkboxes.prop('checked', false);
	//          addedFilters.removeClass('addedFilter');
	//     }

	//     $('.chartInfo').html(chartInfo.html());

	// });
	/* Pathways accordion */
	$('.panel-group.pathway-accordion .panel-default .panel-heading a').on('click', function(){
		let myIdx = $(this).parents('.panel-default').index();
		let pTop = $('#accordion').offset().top;
		let mHgt = $(this).parents('.panel-default').eq(0).find('.panel-heading').height();
		let adjCount = 80;
		if(myIdx == 1){
			adjCount = 60;
		}else if(myIdx == 2){
			adjCount = 40;
		}

		if($(this).hasClass('collapsed')) {
			$("html, body").animate({
				scrollTop:  $(this).offset().top - 60
			},1000);
		}
	})

	$(".popoverBut .popupLink").click(function () {
		if (
			!$(this).parents(".popoverBut").find(".popoverContainer").hasClass("open")
		) {
			$(".popoverBut .popupLink").removeClass("active");
			$(".popoverContainer").removeClass("open").slideUp();
			$(this)
				.parents(".popoverBut")
				.find(".popoverContainer")
				.addClass("open")
				.slideDown();
			$(this).addClass("active");
		} else {
			$(".popoverBut .popupLink").removeClass("active");
			$(this)
				.parents(".popoverBut")
				.find(".popoverContainer")
				.removeClass("open")
				.slideUp();
		}
		return false;
	});

	$(".popoverBut .cancelBut").click(function () {
		$(this).parents(".popoverBut").find(".popoverContainer").slideUp();
		$(".popoverBut .popoverContainer.accountEditPopup .newPasswordBx").hide();
		$(
			".popoverBut .popoverContainer.accountEditPopup .currentPasswordBx"
		).show();
		return false;
	});
	// End Global Popover Container Open / Edit / cancel

	// Header Menu dropdown
	$("header .headerNav ul li.dashboard > a").click(function () {
		$(this).toggleClass("active");
		$(this).parents(".dashboard").find(".dashboardDropDown").slideToggle();
		return false;
	});
	$(".dashboardDropDown").click(function (e) {
		e.stopPropagation();
	});

	$(document).on("click", function (e) {
		$(".dashboardDropDown").slideUp(function () {
			$(".dashboardDropDown").slideUp("");
			$("header .headerNav ul li.dashboard > a").removeClass("active");
		});

		$(".humbergerMenuPopup").fadeOut();

		$(".donutChart .donutInfoBox").fadeOut();

		$(".filterSubOption.terms").slideUp();
		$(".filterSubOption.terms").removeClass("open");

		$(".alliancePatners .allianceDropDown .open").hide(function () {
			$(".allianceDropDown ul > li > a").removeClass("active");
		});
	});

	$(".alliancePatners .allianceDropDown .open").click(function (e) {
		e.stopPropagation();
	});

	$("header .humbergerIcon").click(function (e) {
		e.stopPropagation();
		$(".humbergerIcon").css("visibility", "hidden");
		$(".humbergerMenuPopup").fadeIn();
	});

	//stop propagation
	$(
		".filterSubOption.terms, .humbergerMenuPopup, .donutChart .donutInfoBox"
	).click(function (e) {
		e.stopPropagation();
	});

	$(".topSectionBg .filterAppliedBx .addIcon").click(function () {
		$(this)
			.parents(".filterAppliedBx")
			.find(".filterAppliedDetails")
			.slideDown();
		return false;
	});

	$(".topSectionBg .filterAppliedBx .closePopover").click(function () {
		$(this).parents(".filterAppliedBx").find(".filterAppliedDetails").slideUp();
		return false;
	});

	// End Header Menu dropdownf

	//Header Filters
	//if ($(window).width() >= 768) {
	$(".filterBySection .filterOption li a.filterLink").on("click", function () {
		if (!$(this).parents("li").find(".filterSubOption").hasClass("open")) {
			$(".filterSubOption")
				.removeClass("open")
				.slideUp(function () {
					var filterLinkAnchors = $(this).parents("li").find("a.filterLink");
					if (!$(filterLinkAnchors).find(".filterList").text().trim().length) {
						$(filterLinkAnchors).removeClass("active");
					}
				});
			$(this)
				.parents("li")
				.find(".filterSubOption")
				.addClass("open")
				.slideDown();
			$(this).addClass("active");
		} else {
			$(this)
				.parents("li")
				.find(".filterSubOption")
				.removeClass("open")
				.slideUp(function () {
					var filterLinkAnchor = $(this).parents("li").find("a.filterLink");
					if (!$(filterLinkAnchor).find(".filterList").text().trim().length) {
						$(filterLinkAnchor).removeClass("active");
					}
				});
		}
		return false;
	});

	$(".filterBySection .filterSubOption .clearAllLink a").click(function () {
		$(this).parents(".filterSubOption").find("a").removeClass("active");

		var radioUncheck = $(".filterBySection .radio input[type=radio]").prop(
			"checked",
			false
		);
		$.uniform.update(radioUncheck);

		return false;
	});

	//End Header Filters

	// Global Uniform custom form elements
	$(".customSelect, .customRadio, .customCheck").uniform();

	// Global Accordions
	/* accordian start */
	function hidden(a) {
		$(a).removeClass("active");
		$(".resultItems").removeClass("open");
		$(a).parent().find(".accordianSubUl:first").slideUp();
	}

	function visible(b) {
		$(b).parent().siblings().find("a").removeClass("active");
		$(".resultItems").removeClass("open");
		$(b)
			.parent()
			.parent()
			.find(".accordianLi .accordianSubUl:visible")
			.slideUp();
		$(b).addClass("active");
		$(b).parents(".resultItems").addClass("open");
		$(b).parent().find(".accordianSubUl:first").slideDown();
	}

	function check(c) {
		if ($(c).parent().find(".accordianSubUl:first").is(":hidden")) {
			visible(c);
		} else {
			hidden(c);
		}
	}

	$(".loginLinks a").click(function (e) {
		e.preventDefault();
		let ele = $(this).attr("data-popup");

		$("section.content").addClass("blurContent");
		$("header.headerBg").addClass("blurContent");
		$("." + ele).fadeIn();
	});

	$(".accordianUl .accordianLi:has(.accordianSubUl) > a").click(function () {
		check($(this));
		return false;
	});

	$(".loadSearchButton").click(function (e) {
		var button = $(this),
			data = {
				action: "loadmore",
				s: loadMoreSearch.keyword,
				page: loadMoreSearch.current_page,
				_wpnonce: phpData.rest_nonce,
			};

		$.ajax({
			url: loadMoreSearch.ajaxurl,
			data: data,
			type: "GET",
			beforeSend: function (xhr) {
				button.text("Loading...");
				//console.log('loading button clicked')
			},
			success: function (data) {
				if (data) {
					// console.log('load more button clicked')
					button.html('Load More <span class="pinkRoundedArrow"></span>');
					$(".result_container").append(function () {
						return data["search_results"];
					});
					if (data.load_more == false) {
						button.hide();
						$('.search-trials-load').hide();
					} else {
						button.show();
					}

					loadMoreSearch.current_page++;
					if (loadMoreSearch.current_page === loadMoreSearch.max_page)
						button.remove();
				} else {
					button.remove();
				}
			},
		});
	});

	$(".dropDownBx").on("change", ".customSelect", function (e) {
		e.preventDefault();
		const downloadBut = $(e.target).parents(".popoverContainer").find(".okBut");
		const downloadButHref = downloadBut.attr("href");
		const pageSize = e.target.value.match(/\d+/)[0];
		downloadBut.attr(
			"href",
			UTILITY.updateQueryString(downloadButHref, "posts_per_page", pageSize)
		);
	});

	$(".filterOptionParent .term").click(function (e) {
		e.preventDefault();
		$(this).toggleClass("selected");

		let slugs = [];
		let filterNameList = [];
		const filter = $(this).parents(".filterSubOption").attr("data-filter");
		$(this)
			.parents(".filterSubOption")
			.find(".term.selected")
			.each(function () {
				slugs.push($(this).attr("data-term-slug"));
				filterNameList.push($(this).attr("data-term-name"));
			});

		let slugToString = filterNameList.toString();
		let slugList = slugToString.replace(/,/g, "; ");
		let filterCount = filterNameList.length;

		if (filterNameList.length > 0) {
			slugList = /*": "+*/ slugList;
			filterCount = "&nbsp;(" + filterNameList.length + ")&nbsp;";
			$(this)
				.parents(".widget")
				.find(".filterLink")
				.addClass("active filterSelected");
		}
		if (filterNameList.length == 0) {
			filterCount = "";
			$(this)
				.parents(".widget")
				.find(".filterLink")
				.removeClass("active filterSelected");
		}

		$(this).parents(".widget").find(".filterLink .filterList").html(slugList);
		$(this)
			.parents(".widget")
			.find(".filterLink .filterCount")
			.html(filterCount);

		if (!slugs.length) slugs = [""];
		UTILITY.updateQueryString(
			window.location.href,
			"filter_" + filter,
			slugs.join(",")
		);

		searchFilters();
	});

	$('.navbar-toggle').on('click', function() {
		if($(this).attr('aria-expanded') == 'false') {
			$('body').css('cssText', 'overflow-y: hidden;');
		} else {
			$('body').css('cssText', 'overflow-y: auto;');
		}
	})

	// home page location filter click
	$(".homeFilters .filterSubOption").click(function (e) {
		e.preventDefault();
		return false;
	});

	// Trial Page Scroll Event
	/* trial page desktop on click scroll to respective content start */
	$(document).on("scroll", onScroll);
	var headerHeight = $("header").outerHeight();
	$(".scrollAnimate li a[href*=#]").bind("click", function (e) {
		e.preventDefault();
		$(document).off("scroll");
		$(this).parents(".scrollAnimate").find("a").removeClass("active");
		var target = $(this).attr("href"); //Get the target
		var scrollToPosition = $(target).offset().top - headerHeight + 45;
		$("html, body").animate({ scrollTop: scrollToPosition }, 700, function () {
			window.location.hash = "" + target;
			$("html, body").animate({ scrollTop: scrollToPosition }, 0);
			$(document).on("scroll", onScroll);
		});

		$(this).addClass("active");
	});

	// trial page mobile animation on click
	$(".scrollAnimate2 li a[href*=#]").bind("click", function (e) {
		e.preventDefault();
		$(document).off("scroll");
		$(this).parents(".scrollAnimate2").find("a").removeClass("active");
		var target = $(this).attr("href"); //Get the target
		var scrollToPosition = $(target).offset().top - headerHeight - 50;
		$("html, body").animate({ scrollTop: scrollToPosition }, 700, function () {
			window.location.hash = "" + target;
			$("html, body").animate({ scrollTop: scrollToPosition }, 0);
			$(document).on("scroll", onScroll);
		});
		$(this).addClass("active");
	});

	function onScroll(event) {
		var scrollPos = $(document).scrollTop();
		$(".scrollAnimate li a").each(function () {
			var currLink = $(this);
			var refElement = $(currLink.attr("href"));
			if (
				refElement.position() &&
				refElement.position().top <= scrollPos &&
				refElement.position().top + refElement.height() > scrollPos
			) {
				$(".scrollAnimate li a").removeClass("active");
				currLink.addClass("active");
			} else {
				currLink.removeClass("active");
			}
		});
	}

	/* on click scroll to respective content end */

	/* trial page desktop leftbar stick */
	if ($("#sticky").length) {
		// make sure "#sticky" element exists
		var el = $("#sticky");
		var stickyTop = $("#sticky").offset().top; // returns number
		var stickyHeight = $("#sticky").height();

		$(window).scroll(function () {
			// scroll event
			var limit = $("footer").offset().top - stickyHeight - 20;
			var windowTop = $(window).scrollTop() + headerHeight; // returns number
			if (stickyTop < windowTop) {
				el.addClass("getFixed").css({ position: "fixed", top: headerHeight });
			} else {
				el.removeClass("getFixed").css({ position: "static", top: 0 });
			}
			if (limit < windowTop) {
				var diff = limit - windowTop;
				el.css({ top: diff });
			}
		});
	}

	// trial page mobile leftbar stick
	if ($(".sticky2").length) {
		// make sure "#sticky" element exists
		var el2 = $(".sticky2");
		var stickyTop2 = $(".sticky2").offset().top; // returns number
		var stickyHeight2 = $(".sticky2").height();

		$(window).scroll(function () {
			// scroll event
			var limit = $("footer").offset().top - stickyHeight2 - 20;
			var windowTop = $(window).scrollTop() + headerHeight + 15; // returns number
			var topPosition = headerHeight + 15;
			if (stickyTop2 < windowTop) {
				el2.addClass("getFixed").css({ position: "fixed", top: topPosition });
			} else {
				el2.removeClass("getFixed").css({ position: "relative", top: 0 });
			}
			if (limit < windowTop) {
				var diff = limit - windowTop;
				el2.css({ top: diff });
			}
		});
	}
	/* Get fixed when section reached to the top of window on scroll end */

	// Trail page Change tabs
	$(".studyDetailsSection .tabThumbStyle li a").on("click", function () {
		setTimeout(function () {
			if ($("#studyResults").hasClass("active")) {
				$("#studyDetailsNav").hide();
				$("#studyResultsNav").show();
				var url = document.getElementById("print_button").href;
				var res = url.replace("?tab=1", "?tab=2");
				document.getElementById("print_button").href = res;

				var pdf_url = document.getElementById("pdf_button").href;
				var pdf_res = pdf_url.replace("?tab=1", "?tab=2");
				document.getElementById("pdf_button").href = pdf_res;
			} else {
				$("#studyResultsNav").hide();
				$("#studyDetailsNav").show();
				var url = document.getElementById("print_button").href;
				var res = url.replace("?tab=2", "?tab=1");
				document.getElementById("print_button").href = res;

				var pdf_url = document.getElementById("pdf_button").href;
				var pdf_res = pdf_url.replace("?tab=2", "?tab=1");
				document.getElementById("pdf_button").href = pdf_res;
			}
		}, 200);
	});

	$(window).on('load resize', function() {
		$('.pathways-reference').css('cssText', 'min-height: initial;');
		let containerHeight = $('.celgeneDashboard').outerHeight() + $('header').outerHeight() + $('footer').outerHeight() - $('.pathways-reference').height();
		if($(window).width() > 991) {
			$('.pathways-reference').css('cssText', 'min-height: calc(100vh - '+ (containerHeight + 34)+'px);');
		} else {
			$('.pathways-reference').css('cssText', 'min-height: calc(100vh - '+ (containerHeight + 8)+'px);');
		}
	})

	$('.bms-pathways-landing .disease-title').on('click', function() {
		if($(window).width() < 767) {
			if($(this).hasClass('active')) {
				$(this).next('.disease-container').slideUp();
				$(this).removeClass('active');
			} else {
				$('.bms-pathways-landing .disease-title').removeClass('active');
				$('.bms-pathways-landing .disease-container').slideUp();
				$(this).next('.disease-container').slideDown();
				$(this).addClass('active');
			}

		}
	})

	//End  Trail page Change tabs
	// End Scrollbar Event

	$(document).on("click", "body *", function () {
		$(".humbergerIcon").css("visibility", "visible");
	});

	// Header Popup
	$("body").on("click", "a[data-popup]", function (e) {
		$(".sectionPopup").hide();
		$(".humbergerIcon").css("visibility", "visible");
		var activeSection = $(this).attr("data-popup");
		$("." + activeSection).fadeIn();
		$("header, .filterBySection, .content").addClass("blurContent");
		$("body").addClass("overflow");
		if (activeSection == "loginSection") {
			// document.getElementById("hiddenRedirectField").value = window.location.href;
		}
	});

	$(".sectionPopup .closeBtn, .celgeneMslForm .cancelStyle").click(function () {
		$(".sectionPopup").hide();
		$(".humbergerIcon").css("visibility", "visible");
		$("body").removeClass("overflow");
		$("header, .filterBySection, .content").removeClass("blurContent");
	});
	//End Header Popup

	$(".signupPopup , .loginPopup").click(function (e) {
		e.stopPropagation();
		$(".humbergerMenuPopup").fadeOut();
		$(".humbergerIcon").css("visibility", "visible");
	});

	// Toggle Button Common click Event
	$(".borderBtn").click(function () {
		if ($(this).hasClass("active")) {
			$(this).removeClass("active");
		} else {
			$(this).addClass("active");
		}
	});

	// Switch Button Toggle
	$(".btn-toggle").click(function () {
		$(this).find(".btn").toggleClass("active");

		if ($(this).find(".btn-primary").size() > 0) {
			$(this).find(".btn").toggleClass("btn-primary");
		}

		$(this).find(".btn").toggleClass("btn-default");
	});

	// Mobile Global ul dropdown
	$(".span_select").click(function () {
		$(this).parents(".ulDropdown").find(".options").toggleClass("openselect");
		$(".ulDropdown").toggleClass("active");
	});
	$(".ulDropdown").on("click", ".selItem", function () {
		$(this).parents(".ulDropdown").find(".options").toggleClass("openselect");
	});
	$(document).on('click', function(event){
        if (!$(event.target).closest(".ulDropdown").length && $(".ulDropdown").hasClass('active')){
			$(".ulDropdown").removeClass('active');
			$(".ulDropdown").find(".options").removeClass("openselect");
		}
	});
	$(".options a").click(function () {
		$(".options a").removeClass("active");
		$(this).parents(".ulDropdown").find(".span_select").text("");
		if ($(this).parents(".ulDropdown").find(".selItem").length == 1) {
			$(this).parents(".ulDropdown").find(".selItem").remove();
		}
		$(this)
			.parents(".ulDropdown")
			.find(".span_select")
			.after('<span class="selItem">' + $(this).text() + "</span>");
		$(this).parents(".ulDropdown").find(".options").removeClass("openselect");
		$(this).addClass("active");
		$(".ulDropdown").toggleClass("active");
	});

	/* Global Go top start */
	$("#gotop").click(function () {
		$("html, body").animate({ scrollTop: "0px" }, 1000);
		// $(this).hide(); // optional, Hide on scroll reach to top
		return false;
	});

	//Global Jump to link From header menu
	$(".goToabs a").click(function () {
		$("header .headerNav ul li a").removeClass("active");
		$("html, body").animate(
			{
				scrollTop: $("#aboutBolderScience").length
					? $("#aboutBolderScience").offset().top - $(".header").height() - 50
					: "",
			},
			1000
		);
		$(this).addClass("active");
	});
	/* Go top end */

	//include in header for login and registration
	$(
		'.sectionPopup .um .um-form input[type="text"], .sectionPopup .um .um-form input[type="password"]'
	).focus(function () {
		if ($(this).val().trim().length < 1) {
			$(this).parents(".um-field").find(".um-field-label").addClass("active");
		}
	});
	$(
		'.sectionPopup .um .um-form input[type="text"], .sectionPopup .um .um-form input[type="password"]'
	).blur(function () {
		if ($(this).val().trim().length < 1) {
			$(this)
				.parents(".um-field")
				.find(".um-field-label")
				.removeClass("active");
		}
	});

	$(window).load(function () {
		$('.mobileLegends label[for="js-label-filter-other"]').append(
			'<span class="astrix">*</span>'
		);

		var readmoreHt = $(".pageHeadReadMore.readMoreChild").height();
		if (readmoreHt > 67) {
			$(".readMoreParent").addClass("readMoreShow");
		} else {
			$(".readMoreParent").removeClass("readMoreShow");
		}
	});

	$(".clearAllFilter .resetFilters").click(function (e) {
		e.preventDefault();

		const resetfitlerItem = $(this).attr("data-reset-filter");
		if (resetfitlerItem == "filter_location") {
			UTILITY.updateQueryString(location.href, "filter_location", "");
			UTILITY.updateQueryString(location.href, "filter_state", "");
			UTILITY.updateQueryString(location.href, "bms_city", "");
			UTILITY.updateQueryString(location.href, "dis_location", "");
			UTILITY.updateQueryString(location.href, "dis_radius", "");
			UTILITY.updateQueryString(location.href, "bms_current_location", "");
			UTILITY.updateQueryString(location.href, "orderby", "relevance");
			window.location.reload();
		}

		const resetFilter = new URL(document.location).searchParams.get(
			resetfitlerItem
		);
		window.location.replace(window.location.href.replace(resetFilter, ""));
	});

	if (
		$("body").hasClass("post-type-archive-molecule") ||
		$("body").hasClass("single-trial")
	) {
		window.addEventListener(
			"DOMContentLoaded",
			function () {
				addPdfLink();
			},
			false
		);
		document
			.querySelector("#download_pdf")
			.addEventListener("click", function () {
				addPdfLink(true);
			});

		function addPdfLink(isClick) {
			var _OBJECT_URL;

			var request = new XMLHttpRequest();

			let downloadText = "";
			if (isClick && $("body").hasClass("post-type-archive-molecule")) {
				downloadText = "All <br> Pipeline Molecules";
			}

			request.addEventListener("readystatechange", function (e) {
				if (isClick && request.readyState == 2 && request.status == 200) {
					// Download is being started
					$("#downloading_pdf").html("`Downloading.. ${downloadText}");
				} else if (isClick && request.readyState == 3 && isClick) {
					// Download is under progress
					$("#downloading_pdf").html(`Downloading... ${downloadText}`);
				} else if (request.readyState == 4) {
					// Downloaing has finished
					if (isClick) {
						$("#downloading_pdf").html(`Download ${downloadText}`);
					}
					if (window.navigator.msSaveOrOpenBlob) {
						// IE11
						if (isClick) {
							var url = window.location.pathname.split("/");
							var filename = url[2].toUpperCase() + ".pdf";
							window.navigator.msSaveOrOpenBlob(request.response, filename);
						}
					} else {
						_OBJECT_URL = window.URL.createObjectURL(request.response);

						// Set href as a local object URL
						document
							.querySelector("#download_pdf")
							.setAttribute("href", _OBJECT_URL);

						// Recommended : Revoke the object URL after some time to free up resources
						// There is no way to find out whether user finished downloading
						setTimeout(function () {
							window.URL.revokeObjectURL(_OBJECT_URL);
						}, 60 * 1000);
					}
				}
			});

			if (isClick) {
				request.addEventListener("progress", function (e) {
					var percent_complete = (e.loaded / e.total) * 100;
				});
			}

			request.open(
				"get",
				document.querySelector("#download_pdf").getAttribute("data-href")
			);
			request.responseType = "blob";
			request.send();
		}
	}

	window.onload = () => {
		$('[data-toggle="popover"]').popover();

		// user id cookie set and remove on login logout
		if (phpData.userId != 0) {
			var d = new Date();
			d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * 365 * 2);
			var expires = "expires=" + d.toGMTString();
			document.cookie =
				"userId=" + phpData.userId + "; " + expires + "; path=/";
		} else if (phpData.userId == 0) {
			document.cookie = "userId=; Max-Age=-99999999;";
		}

		var url_string = window.location.href;
		var url = new URL(url_string);
		var searchType = url.searchParams.get("search_type");

		if (searchType == "celgene") {
			$(".filterBySection .clearSaveBox .clearLink").attr(
				"href",
				"/?s=&orderby=relevance&search_type=celgene&filter_celgene_trial=celgene-trial,celgene-compound"
			);
		}

		if (!UTILITY.getQueryString(window.location.href, "dis_radius")) {
			$("#customOrder").children('option[value="geo_distance"]').hide();
			$("#customOrder")
				.children('option[value="geo_distance"]')
				.attr("disabled", "disabled");
			$("#customOrder").val("relevance");
		}

		$("body").on("click", function (e) {
			//home page location filter slide up on outside click
			$(".homeFilters .filterSubOption").slideUp();

			// if ($(window).width() < 768) {
			//     $(".mobileLegends .mobileDropdown").removeClass("active");
			//     $(".mobileLegends .customDropdown").removeClass("open");
			//     $(".mobileLegends .customDropdown").slideUp();
			// }

			// $('.filterAppliedDetails').slideUp();

			// search listing page click outside of filters
			if ($("body").hasClass("search") == true) {
				$(".filterOption li").each(function (e) {
					if ($(this).find("a").hasClass("filterSelected") == false) {
						$(this).find(".filterLink").removeClass("active");
					}
				});
			}

			$('[data-toggle="popover"]').each(function () {
				//the 'is' for buttons that trigger popups
				//the 'has' for icons within a button that triggers a popup
				if (
					!$(this).is(e.target) &&
					$(this).has(e.target).length === 0 &&
					$(".popover").has(e.target).length === 0
				) {
					$(this).popover("hide");
				}
			});
		});

		// for datalist enhancement

		$(".savedClinicalItemsContainer").on(
			"click",
			".deleteIcon.deleteTopRow",
			function (e) {
				e.preventDefault();
				let trialId = $(this).attr("data-trial-id");
				api
					.delete(`user/${phpData.userId}/unsave-trial`, {
						trial_id: trialId,
					})
					.then(function (response) {
						location.reload();
					});
			}
		);

		// for login
		$(".doximityLogin").click((e) => {
			const doximityAuth = new ClientOAuth2({
				clientId: phpData.doximity.clientId,
				clientSecret: phpData.doximity.clientSecret,
				authorizationUri: phpData.doximity.authorizationUri,
				redirectUri: phpData.doximity.redirectUriLogin,
				scopes: phpData.doximity.scopes,
				accessTokenUri: phpData.doximity.accessTokenUri,
				type: phpData.doximity.type,
				state: phpData.doximity.state,
			});

			window.open(doximityAuth.code.getUri());
		});

		$(".saveTrialPopupContainer .borderButtonBlue").click((e) => {
			const doximityAuth = new ClientOAuth2({
				clientId: phpData.doximity.clientId,
				clientSecret: phpData.doximity.clientSecret,
				authorizationUri: phpData.doximity.authorizationUri,
				redirectUri: phpData.doximity.redirectUriLogin,
				scopes: phpData.doximity.scopes,
				accessTokenUri: phpData.doximity.accessTokenUri,
				type: phpData.doximity.type,
				state: phpData.doximity.state,
			});

			window.open(doximityAuth.code.getUri());
		});

		// for registration
		$(".doximityRegistration").click((e) => {
			const doximityAuth = new ClientOAuth2({
				clientId: phpData.doximity.clientId,
				clientSecret: phpData.doximity.clientSecret,
				authorizationUri: phpData.doximity.authorizationUri,
				redirectUri: phpData.doximity.redirectUriRegistration,
				scopes: phpData.doximity.scopes,
				accessTokenUri: phpData.doximity.accessTokenUri,
				type: phpData.doximity.type,
				state: phpData.doximity.state,
			});

			window.open(doximityAuth.code.getUri());
		});
		//for filters data value change on page load

		let filterSubOptionStatus = '.filterSubOption[data-filter="status"]';
		let checkedStatusInput = $(
			'.filterSubOption[data-filter="status"] input:checked'
		);
		if (checkedStatusInput.length) {
			$(filterSubOptionStatus)
				.parents("li")
				.find(".filterLink")
				.addClass("active filterSelected");
			let statusString = checkedStatusInput
				.parent()
				.text()
				.replace(/\s\s+/g, "; ");
			//change the value
			$(filterSubOptionStatus)
				.parents("li")
				.find(".filterList")
				.text(statusString.substring(2, statusString.length - 2));
			$(filterSubOptionStatus)
				.parents("li")
				.find(".filterCount")
				.text(` (${$(checkedStatusInput).length}) `);
		}
		let filterSubOptionPhase = '.filterSubOption[data-filter="phase"]';
		let checkedPhaseInput = $(
			'.filterSubOption[data-filter="phase"] input:checked'
		);
		if (checkedPhaseInput.length) {
			$(filterSubOptionPhase)
				.parents("li")
				.find(".filterLink")
				.addClass("active filterSelected");
			let phaseString = checkedPhaseInput
				.parent()
				.text()
				.replace(/\s\s+/g, "; ");
			//change the value
			$(filterSubOptionPhase)
				.parents("li")
				.find(".filterList")
				.text(phaseString.substring(2, phaseString.length - 2));
			$(filterSubOptionPhase)
				.parents("li")
				.find(".filterCount")
				.text(` (${$(checkedPhaseInput).length}) `);
		}

		let filterSubOptionAge = '.filterSubOption[data-filter="age"]';
		let checkedAgeInput = $(
			'.filterSubOption[data-filter="age"] input:checked'
		);
		if (checkedAgeInput.length) {
			$(filterSubOptionAge)
				.parents("li")
				.find(".filterLink")
				.addClass("active filterSelected");
			let statusString = checkedAgeInput
				.parent()
				.text()
				.replace(/\s\s+/g, "; ");
			//change the value
			$(filterSubOptionAge)
				.parents("li")
				.find(".filterList")
				.text(statusString.substring(2, statusString.length - 2));
			$(filterSubOptionAge)
				.parents("li")
				.find(".filterCount")
				.text(` (${$(checkedAgeInput).length}) `);
		}

		let filterSubOptionSex = '.filterSubOption[data-filter="sex"]';
		let checkedSexInput = $(
			'.filterSubOption[data-filter="sex"] input:checked'
		);
		if (checkedSexInput.length) {
			$(filterSubOptionSex)
				.parents("li")
				.find(".filterLink")
				.addClass("active filterSelected");
			let statusString = checkedSexInput
				.parent()
				.text()
				.replace(/\s\s+/g, "; ");
			//change the value
			$(filterSubOptionSex)
				.parents("li")
				.find(".filterList")
				.text(statusString.substring(2, statusString.length - 2));
			$(filterSubOptionSex)
				.parents("li")
				.find(".filterCount")
				.text(` (${$(checkedSexInput).length}) `);
		}
		if (
			$("body").hasClass("page-template-celgene-landing") ||
			$("body").hasClass("tax-specialty") ||
			$("body").hasClass("single-disease-area") ||
			$("body").hasClass("single-molecule") ||
			$("body").hasClass("single-pathways") ||
			$("body").hasClass("post-type-archive") ||
			$("body").hasClass("post-type-archive-alliance") ||
			$("body").hasClass("searchFromCelgene")
		) {
			searchTermType = "celgene";
		} else if (
			$("body").hasClass("page-template-page-account-preferences") ||
			($("body").hasClass("home") && $(".signUpSection").is(":visible") == true)
		) {
			searchTermType = "interventions";
		} else if ($("body").hasClass("page-template-page-search-patient-type")) {
			searchTermType = "conditions";
		}

		const searchOptions = {
			url: function (phrase) {
				var apiURL;
				switch (searchTermType) {
					case "all":
						apiURL =
							"/wp-json/boldsci/v1/search/search_param/?s=" +
							phrase +
							"&_wpnonce=" +
							phpData.rest_nonce;
						break;
					case "celgene":
						apiURL =
							"/wp-json/boldsci/v1/search/search_param/?s=" +
							phrase +
							"&_wpnonce=" +
							phpData.rest_nonce;
						break;
					case "interventions":
						apiURL =
							"/wp-json/boldsci/v1/search/search_param/?s=" +
							phrase +
							"&_wpnonce=" +
							phpData.rest_nonce +
							"&type=interventions";
						break;
					case "conditions":
						apiURL =
							"/wp-json/boldsci/v1/search/search_param/?s=" +
							phrase +
							"&_wpnonce=" +
							phpData.rest_nonce +
							"&type=conditions";
						break;
				}
				return apiURL;
			},
			list: {
				match: {
					enabled: true,
					method: function method(a, b) {
						try {
							return a.search(b) > -1;
						} catch (error) {
							console.log("no result found");
						}
						return;
					},
				},
				onClickEvent: function (e) {},
			},
			template: {
				type: "custom",
				method: function (value, item) {
					if (item.url == "") {
						if (searchTermType == "all") {
							// return "<span class='searchItem'>"+value+"</span> <span class='searchType'>"+item.type+"</span>"
							return "<span class='searchItem'>" + value + "</span>";
						} else {
							return value;
						}
					} else {
						if (searchTermType == "celgene") {
							// return "<a href='" + item.url + "'><span class='searchItem'>"+value+"</span><span class='searchType'>"+item.type+"</span></a>"
							return "<span class='searchItem'>" + value + "</span>";
						} else {
							if (searchTermType == "all") {
								// return "<span class='searchItem'>"+value+"</span> <span class='searchType'>"+item.type+"</span>"
								return "<span class='searchItem'>" + value + "</span>";
							} else {
								return value;
							}
						}
					}
				},
			},
			listLocation: "search_results",
			getValue: "name",
		};

		const searchHeaderOptions = {
			url: function (phrase) {
				return (
					"/wp-json/boldsci/v1/search/search_param/?s=" +
					phrase +
					"&_wpnonce=" +
					phpData.rest_nonce
				);
			},
			list: {
				match: {
					enabled: true,
					method: function method(a, b) {
						try {
							return a.search(b) > -1;
						} catch (error) {
							console.log("no result found");
						}
						return;
					},
				},
				onClickEvent: function (e) {},
			},
			template: {
				type: "custom",
				method: function (value, item) {
					if (item.url == "") {
						//  return "<span class='searchItem'>"+value+"</span> <span class='searchType'>"+item.type+"</span>"
						return "<span class='searchItem'>" + value + "</span>";
					} else {
						if (searchTermType == "celgene") {
							// return "<a href='" + item.url + "'><span class='searchItem'>"+value+"</span><span class='searchType'>"+item.type+"</span></a>"
							return "<span class='searchItem'>" + value + "</span>";
						} else {
							//  return "<span class='searchItem'>"+value+"</span> <span class='searchType'>"+item.type+"</span>"
							return "<span class='searchItem'>" + value + "</span>";
						}
					}
				},
			},
			listLocation: "search_results",
			getValue: "name",
		};

		const searchCelgene = {
			url: function (phrase) {
				return (
					"/wp-json/boldsci/v1/search/new_search_param/?s=" +
					phrase +
					"&_wpnonce=" +
					phpData.rest_nonce
				);
			},
			list: {
				maxNumberOfElements: 100,
				match: {
					enabled: false,
				},
				onClickEvent: function (e) {},
			},
			template: {
				type: "custom",
				method: function (value, item) {
					$(".celgeneSearchInput").addClass("ea-dropDown");
					$(".celgeneSearchIcon").addClass("ea-dropDown");
					return (
						"<a href='" +
						item.url +
						"'><span class='searchItem'>" +
						value +
						"</span><span class='searchType'>" +
						item.type +
						"</span></a>"
					);
				},
			},

			listLocation: "search_results",
			getValue: "name",
		};

		const showDropDownKey = () => {
			var key = event.keyCode || event.charCode;

			if (key == 8 || key == 46) {
				if ($(".search-term-celgene").val().length < 4) {
					$(".celgeneSearchInput").removeClass("ea-dropDown");
					$(".celgeneSearchIcon").removeClass("ea-dropDown");
				}
			}
		};

		const showDropDownBlur = () => {
			$(".celgeneSearchInput").removeClass("ea-dropDown");
			$(".celgeneSearchIcon").removeClass("ea-dropDown");
		};

		const showDropDownFocus = () => {
			if ($("#eac-container-eac-3285 ul").find("li").length > 0) {
				$(".celgeneSearchInput").addClass("ea-dropDown");
				$(".celgeneSearchIcon").addClass("ea-dropDown");
			}
		};

		$(".search-term-header").easyAutocomplete(searchHeaderOptions);
		$(".search-terms").easyAutocomplete(searchOptions);

		$(".search-term-celgene").easyAutocomplete(searchCelgene);
		$(".search-term-celgene").focus(showDropDownFocus);
		$(".search-term-celgene").blur(showDropDownBlur);
		$(".search-term-celgene").keydown(showDropDownKey);

		$(window).resize(function(event){
			if($('.mobileOnly').hasClass('active') || $('.desktopOnly').hasClass('active')) {
				$(".search-term-header").easyAutocomplete(searchHeaderOptions);
				$(".search-terms").easyAutocomplete(searchOptions);
				$(".search-term-celgene").easyAutocomplete(searchCelgene);
				$('.desktopOnly').removeClass('active');
				$('.mobileOnly').removeClass('active');
			}

			$(".search-term-celgene").focus(showDropDownFocus);
			$(".search-term-celgene").blur(showDropDownBlur);
			$(".search-term-celgene").keydown(showDropDownKey);
			showDropDownBlur();
			showDropDownFocus();

		});

		$(".search-term-celgene").on('input', function () {
			let inVal = $(this).val();
			if (inVal.length > 0) {
				$('.header-search').addClass('active');
			}else{
				$('.header-search').removeClass('active');
			}
		})
		$('.header-search').on('click', function(){
			$(".search-term-celgene").val('');
			$(this).removeClass('active');
		})
		$(".search-term-celgene").on('focus', function () {
			let inVal = $(this).val();
			if (inVal.length > 0) {
				$('.header-search').addClass('active');
			}else{
				$('.header-search').removeClass('active');
			}
		})
	};

	if ($("body").find("#recur").length > 0) {
		$(".recurClass").show();
	}

	$(".recurClass").click(function () {
		$("html,body").animate(
			{
				scrollTop: $(".loadRecruiting").offset().top - 106,
			},
			"slow"
		);
	});

	$(window).on("load", function () {
		$(".page-template-bms-site-map .sitemap-links .disable-pathway-cat-link").on("click", function(e) {
			e.preventDefault();
			});

		// Bms popup cookie start
		const queryString = window.location.search;
		const urlParams = new URLSearchParams(queryString);
		const conferenceView = urlParams.get('conference-view')

		if ($("div").hasClass("bms_popup")) {
			var value = UTILITY.getCookie("popup");
			if(conferenceView == 'true'){
				return;
			}
			if (value != "") {
				$("#interstialPopup2").hide();
			} else {
				$("body").addClass("modal-open");
				$("#interstialPopup2").show();
				$("#interstialPopup2").animate({ opacity: 1, top: "-10px" }, "normal");
			}
		}
		// Bms popup cookie ends
	});

	$(".bmsCont").on("click", function (e) {
		UTILITY.setCookieInHours("popup", "true", 1);
		$("body").removeClass("modal-open");
		$("#interstialPopup2").hide();
	});

	//popup close
	$("#jsClose").on("click", function (e) {
		UTILITY.setCookieInHours("popup", "true", 1);
		$("body").removeClass("modal-open");
		$("#interstialPopup2").hide();
	});

	// BMS popup close on clicking link
	$(".abtBms")
		.has("a")
		.click(function () {
			UTILITY.setCookieInHours("popup", "true", 365);
			$("body").removeClass("modal-open");
			$("#interstialPopup2").hide();
		});

	$("#interstialPopup2").on("click", function () {
		$("body").removeClass("modal-open");
		$("#interstialPopup2").hide();
		UTILITY.setCookieInHours("popup", "true", 1);
	});

	$("#interstialPopup2 .modal-content").on("click", function (e) {
		e.stopPropagation();
	});

	$("#interstialPopup2").on("click", function () {
		$("body").removeClass("modal-open");
		$("#interstialPopup2").hide();
		UTILITY.setCookie("popup", "true", 365);
	});

	function isSearchSaved() {
		// Get Url
		const href = window.location.href;
		const urlParams = new URLSearchParams(href);
		// Get Param Types
		const searchType = urlParams.get("search_type");
		// API Call to Save Search
		api
			.post(`user/${phpData.userId}/validate-save`, {
				search_url: href,
				search_type: searchType,
				noLoader: true,
			})
			.then(function (response) {
				//location.reload();
				// elementTarget.disabled = false;
				if (response[0] != 200) {
					$(document).find(".saveSearchBtn").text("Saved");
				} else {
					$(document).find(".saveSearchBtn").text("Save Search");
					console.log($(document).find(".saveSearchBtn").disabled);
				}
			});
	}

	$("button.loadTrialButton").click(function (e) {
		searchFilters($(this));
	});

	$('header.sub-header .navbar .navbar-nav li .dropdown-menu li a').on('click', function(){
		if ($(window).width() <= 991) {
			$(this).next('.dropdown-menu-inner').addClass('active');
		}
	})
	$('.back-link').on('click', function(){
		if ($(window).width() <= 991) {
			$(this).parents('.dropdown-menu-inner').removeClass('active');
		}
	})
	$('header.sub-header .navbar .navbar-nav li .dropdown-menu li').mouseenter(function(){
		if ($(window).width() >= 992) {
			$('header.sub-header .navbar .navbar-nav li .dropdown-menu li').removeClass('active');
		}
	});
	$('header.sub-header').mouseleave(function() {
		if ($(window).width() >= 992) {
			$('header.sub-header .navbar .navbar-nav li .dropdown-menu li').each(function(){
				if($(this).find('.dropdown-menu-inner').hasClass('active')){
					$(this).addClass('active');
				}
			});
		}
	})

	// console.log(UTILITY.getCookie("acceptCookie"))
	let acceptCookie = UTILITY.getCookie("acceptCookie");
	if(!acceptCookie){
		$('.cookie-consent').show();
		if($('.cookie-consent').length){
			let headerHeight = $('header').height()-3;
			// alert(headerHeight)
			$('.submenu-padding').css('padding-top', headerHeight);
			$('.btn-accept-cookie').on('click', function(){
				$('.cookie-consent').remove();
				headerHeight = $('header').height();
				// alert(headerHeight);
				$('.submenu-padding').css('padding-top', headerHeight);
				UTILITY.setCookie("acceptCookie", "true", 365);
			})
		}
	}

	function searchFilters(loadmoreBtn) {
		let requestData = {
			action: "search_celgene_filters",
			query: loadMoreTrials.posts,
			meta: UTILITY.getParamsByPrefix(["meta_", "date_"]),
			dist: UTILITY.getParamsByPrefix(["dis_"]),
			filter: UTILITY.getParamsByPrefix(["filter"]),
			orderby: UTILITY.getParams(["orderby"]),
			page: loadmoreBtn ? loadMoreTrials.current_page : 0,
			_wpnonce: phpData.rest_nonce,
			isAdminAjax: true,
		};

		if (loadmoreBtn) {
			requestData["single"] = loadMoreTrials.single;
			requestData["taxonomy"] = loadMoreTrials.taxonomy;
			requestData["term"] = loadMoreTrials.term;
		}

		$.ajax({
			url: loadMoreTrials.ajaxurl,
			data: requestData,
			type: "POST",
			beforeSend: function (xhr) {
				$(".preloader").show();
				$("button.loadTrialButton").text("Loading...");
			},
			success: function (data) {
				if (data) {
					var totalCount = data.total_count;
					let onPageTrials = $(".resultItems").length + 5;
					console.log(onPageTrials);
					if (onPageTrials >= totalCount) {
						$("button.loadTrialButton").hide();
					} else {
						$("button.loadTrialButton").show();
					}
					$(".preloader").hide();
					$("button.loadTrialButton").text("Load More Trials");
					if (!isNaN(totalCount)) {
						$(".trialCount").text(totalCount);
						if (totalCount == 0) {
							$("#zeroTrails").modal("show");
						}
					}

					if (loadmoreBtn) {
						$(".resultContainer").append(function () {
							return $(data.html).click(function (e) {
								if ($(e.target).hasClass("showHideArrow")) {
									check($(e.target));
									return false;
								}
							});
						});
					} else {
						$(".resultContainer").html(function () {
							return $(data.html).click(function (e) {
								if ($(e.target).hasClass("showHideArrow")) {
									check($(e.target));
									return false;
								}
							});
						});
					}

					if (loadmoreBtn) {
						loadMoreTrials.current_page++;
						if (loadMoreTrials.current_page === loadMoreTrials.max_page)
							loadmoreBtn.remove();
					}
					loadMoreTrials.posts = data.query;

					if ($(window).width() <= 767) {
						$("html, body").animate({ scrollTop: 0 }, 500);
					}
				}

				isSearchSaved();

				if (
					!requestData["filter"].filter_location &&
					!requestData["dist"].dis_location
				) {
					$(".resultContainer .resultItems").first().removeClass("open");
					$(".resultContainer .resultItems.open .resultItemsExpand").css(
						"display",
						"none"
					);
					$(".accordianLi .showHideArrow").first().removeClass("active");
				} else {
					$(".resultContainer .resultItems").first().addClass("open");
					$(".resultContainer .resultItems.open .resultItemsExpand").css(
						"display",
						"block"
					);
					$(".accordianLi .showHideArrow").first().addClass("active");
				}
			},
		});
	}
	$('.nct-popup').on('click', function () {
		if($('body').hasClass('search')){
			// console.log($(this).parent().parent().next('.hidden').find('.modal-content'))
			let dataShow = '.' + $(this).data('view');
			$(this).parent().parent().next('.hidden').find('.modal-content').find('li').addClass('hidden');
			$(this).parent().parent().next('.hidden').find('.modal-content').find(`li${dataShow}`).removeClass('hidden');
			let content = $(this).parent().parent().next('.hidden').find('.modal-content').clone();
			$("#myVideoModal .modal-dialog").empty();
			let closeBtn = '<button type="button" class="close" data-dismiss="modal">&nbsp;</button>'
			$("#myVideoModal .modal-dialog").append(closeBtn);
			$("#myVideoModal .modal-dialog").append(content);
		}
	});

	// $('.dropdown-menu li').mouseover(function() {
	// 	if ($(window).width() >= 992) {
	// 		let minHeight = 252;
	// 		let menuHeight = $(this).find('.dropdown-menu-inner').height()+22;
	// 		$('.dropdown-menu').css('min-height', '252px');
	// 		if(menuHeight > minHeight){
	// 			$(this).parent('.dropdown-menu').css('min-height', menuHeight);
	// 		}else{
	// 			$('.dropdown-menu').css('min-height', '252px');
	// 			$(this).find('.dropdown-menu-inner').css('min-height', '252px');
	// 		}
	// 	}
	// }).mouseout(function(){
	// 	$('.dropdown-menu').removeAttr('style');
	// });
	// $('.dropdown-menu li .dropdown-menu-inner ul li').mouseover(function() {
	// 	if ($(window).width() >= 992) {
	// 		let minHeight = 252;
	// 		let menuHeight = $(this).parent().parent().height()+22;
	// 		console.log($(this).parent().parent().parent().attr('class'));
	// 		$('.dropdown-menu').css('min-height', '252px');
	// 		if(menuHeight > minHeight){
	// 			$('.dropdown-menu').css('min-height', menuHeight);
	// 		}else{
	// 			$('.dropdown-menu').css('min-height', '252px');
	// 		}
	// 	}
	// }).mouseout(function(){
	// 	$('.dropdown-menu').removeAttr('style');
	// });

	UTILITY.polyfill();
};

module.exports = customJS;
