let BSChart = require("./bs-chart");
let API = require("./api");

let dashboardYourDashboard = function() {
    let $ = jQuery;
    const api = new API();

	const container = $(".dashboardCont");
	let dom = {
        window: $(window),
        document: $(document),
        body: $('body')
    };

	// Add first set of data on page load.
	window.addEventListener( 'DOMContentLoaded', handleOnLoad, false );

    const views = {
    	chart: new BSChart()
	};

	// Tooltip Code
	function getCookie(name) {
		var dc = document.cookie;
		var prefix = name + "=";
		var begin = dc.indexOf("; " + prefix);
		if (begin == -1) {
			begin = dc.indexOf(prefix);
			if (begin != 0) return null;
		}
		else
		{
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
			end = dc.length;
			}
		}
		// because unescape has been deprecated, replaced with decodeURI
		//return unescape(dc.substring(begin + prefix.length, end));
		return decodeURI(dc.substring(begin + prefix.length, end));
	}

	eraseCookie = (name) => {
		document.cookie = name+'=; Max-Age=-99999999;';  
	}
	
	container.find(".tourPopup.bigSize .closeTourPopup").click(function(e) {
		$(this).parents('.tourPopup.bigSize').hide();
		eraseCookie(`isTrialupdatePopupViewed_${phpData.userId}`);
		document.cookie=`isTrialupdatePopupViewed_${phpData.userId}=true`;
	});

	let popup = getCookie(`isTrialupdatePopupViewed_${phpData.userId}`);

	if(popup == "true"){
		$(".tourPopup.bigSize").hide();
	}
	else
	{
		if(popup == 'null') {
			document.cookie=`isTrialupdatePopupViewed_${phpData.userId}=false`;
		}
		$(".tourPopup.bigSize").show();
	}
	// End Tooltip Code


	// Info for donut chart
	container.find('.donutChart .infoIcon').click(function(){
		$(this).parents('.infoIconConatiner').find('.donutInfoBox').fadeIn();
		return false;
	});

	container.find('.donutChart .closeBtn').click(function(){
		$(this).parents('.infoIconConatiner').find('.donutInfoBox').fadeOut();
		return false;
	});

	/**
	 * Handle AJAX response to Elastic Search on page load.
	 */
	function handleOnLoad(e) {
		if(!$("canvas").length) {
			return false;
		}

		if ('' !== phpData.payload) {
			// set initial checkboxes
			// Get status filters.
			views.chart.init(phpData.payload, false);

			return;
		}

		api.get(phpData.searchApiUrl, {
			// request: {
				'post__in': phpData.post__in
			// }
		}).then( function(data) {
			//console.log(data);
			views.chart.init(data, false);
			//views.chart.processResponse
		}, views.chart.errorHandler );
	}

};

module.exports = dashboardYourDashboard;