let UTILITY = require("./utility");

let API = function () {
	let $ = jQuery;
	const namespace = "/wp-json/boldsci/v1/";

	this.get = function (url, data = {}) {
		data._wpnonce = phpData.rest_nonce;
		return new Promise(function (resolve, reject) {
			let xhr = $.ajax(
				{
					type: "GET",
					contentType: "application/json",
					url: url,
					data: data,
					dataType: "json",
				},
				function (data) {},
				"json"
			);
			xhr.done(function (data) {
				resolve(data);
			});
			xhr.fail(function (err) {
				reject(err);
			});
		});
	};

	/**
	 * @param {*} error
	 * Geolocation error handling
	 */
	this.showError = function (error) {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				alert("You've denied the request for Geolocation.");
				break;

			case error.POSITION_UNAVAILABLE:
				alert("Location information is unavailable.");
				break;

			case error.TIMEOUT:
				alert("The request to get your location timed out.");
				break;

			case error.UNKNOWN_ERROR:
				alert("An unknown error occurred.");
		}
	};

	/* GET GeoLocation function not accept any argument
	 * **
	 * ** @return as String - lat and lon with seprated by comma
	 * **
	 * */
	this.get_geo = (initialising) => {
		let lat, lon;
		// if (navigator.geolocation) {
			return new Promise((resolve, reject) => {
				reject("We are not fetching the location");
				/*navigator.geolocation.getCurrentPosition(
					(position) => {
						lat = position.coords.latitude.toFixed(5);
						lon = position.coords.longitude.toFixed(5);

						UTILITY.setCookie("bs_loc", "true", 365);
						resolve({
							lat: lat,
							lon: lon,
						});
					},
					(error) => {
						UTILITY.setCookie("bs_loc", "false", 365);
						console.log(initialising, error);
						if (!initialising) {
							this.showError(error);
						}
						reject(error);
					}
				);*/
			});
		// } else {
		// 	alert("Geolocation is not supported by this browser.");
		// }
	};

	this.delete = function (url, data = {}) {
		data._wpnonce = phpData.rest_nonce;
		return new Promise(function (resolve, reject) {
			let xhr = $.ajax(
				{
					type: "DELETE",
					contentType: "application/json",
					url: namespace + url,
					data: JSON.stringify(data),
					dataType: "json",
				},
				function (data) {},
				"json"
			);
			xhr.done(function (data) {
				resolve(data);
			});
			xhr.fail(function (err) {
				reject(err);
			});
		});
	};

	this.post = function (url, data) {
		// data._wpnonce = phpData.rest_nonce;

		let requestData = {
			type: "POST",
			url: data.isAdminAjax
				? `${url}?_wpnonce=${phpData.rest_nonce}`
				: namespace + `${url}?_wpnonce=${phpData.rest_nonce}`,
			data: data.isAdminAjax ? data : JSON.stringify(data),
		};

		if (!data.isAdminAjax) {
			requestData["contentType"] = "application/json";
			requestData["dataType"] = "json";
		}

		return new Promise(function (resolve, reject) {
			let xhr = $.ajax(requestData, function (data) {}, "json");
			if (!data.noLoader) {
				$(".preloader").show();
			}
			xhr.done(function (data) {
				resolve(data);
			});
			xhr.fail(function (err) {
				reject(err);
			});
		});
	};
};

module.exports = API;
