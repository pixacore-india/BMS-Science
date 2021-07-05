require('bootstrap');
const { URL, URLSearchParams } = require( '@lvchengbin/url' );
var celgenePipeline = function() {
	//figure out a better way of doing this
	let $ = jQuery;
	let container = $(".pipelineSection");
	let videoContainer = $("#myVideoModal");
	let videoTitle = videoContainer.find(".modal-header");
	let videoContent = videoContainer.find(".modal-body .videoPlaceholder");
	let dropDown = container.find(".selectPipe select");
    let dom = {
        window: $(window),
        document: $(document),
        body: $('body')
	};

	container.find('.PipeLineCard .front .flipIcon').click(function(){
		$(this).parents('.phoneBack').find('.card').addClass('flipped');
	});
	
	container.find('.PipeLineCard .back .flipIcon').click(function(){
		$(this).parents('.phoneBack').find('.card').removeClass('flipped');
	});

	container.find(".playIcon").on('click', '[data-toggle="modal"]', function (e) {
		let modalVideo = $(this).parents(".card").attr("data-video");
		let modalTitle = $(this).parents(".card").attr("data-video-title");
		videoTitle.html(modalTitle);
		videoContent.html(modalVideo);
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

	
	container.find('.modal .close').click(function(){
		$('.videoPlaceholder iframe').attr("src", $(".videoPlaceholder iframe").attr("src"));
	});
	$('#myVideoModal').on('hidden.bs.modal', function () {
		$('.videoPlaceholder iframe').attr("src", $(".videoPlaceholder iframe").attr("src"));
	});

	dropDown.change(function(){
		var dropdownId = $(this).attr("id");
		var value = $(this).val();
		var href = window.location.href;
		
		if(value == "All disease areas" || value == "All pathways" || value == "All phases"){

			let url = new URL(window.location.href);
			let params = new URLSearchParams(url.search.slice(1));
			window.location = removeParams(dropdownId);
			return false;
		}
		if (window.location.href.indexOf("?") == -1) {
			window.location.href=href+"?"+dropdownId+"="+value;
		}
		else{
			window.location.href = 	UpdateQueryString(window.location.href, dropdownId, value);
		}
		
	});

	function removeParams(sParam){
				var url = window.location.href.split('?')[0]+'?';
				var sPageURL = decodeURIComponent(window.location.search.substring(1)),
					sURLVariables = sPageURL.split('&'),
					sParameterName,
					i;
			
				for (i = 0; i < sURLVariables.length; i++) {
					sParameterName = sURLVariables[i].split('=');
					if (sParameterName[0] != sParam) {
						url = url + sParameterName[0] + '=' + sParameterName[1] + '&'
					}
				}
				return url.substring(0,url.length-1);
	}
	
	function UpdateQueryString(uri, key, value) {
		var re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
		if (uri.match(re)) {
		  return uri.replace(re, '$1' + key + "=" + value + '$2');
		} else {
		  var hash =  '';
		  if( uri.indexOf('#') !== -1 ){
			  hash = uri.replace(/.*#/, '#');
			  uri = uri.replace(/#.*/, '');
		  }
		  var separator = uri.indexOf('?') !== -1 ? "&" : "?";    
		  return uri + separator + key + "=" + value + hash;
		}
	  }
	
};


module.exports = celgenePipeline;

