require("bootstrap");
require("jqueryValidator");
let API = require("../api");

var celgeneLanding = function () {
	//figure out a better way of doing this
	let $ = jQuery;
	const api = new API();

	var validator = $("#mslForm").validate({
		rules: {
			salutation: "required",
			country: "required",
			first_name: "required",
			last_name: "required",
			phone: {
				required: true,
				phoneUS: true,
			},
			email: {
				required: true,
				email: true,
			},
			address: "required",
			city: "required",
			region: "required",
			zipcode: {
				required: true,
				zipcodeUS: true,
			},
			describe: "required",
			topic: {
				required: true,
				topicSpace: true,
			},
		},
		messages: {
			salutation: "Required",
			country: "Required",
			first_name: "Required",
			last_name: "Required",
			phone: {
				required: "Required",
				phoneUS: "Enter valid number",
			},
			email: {
				required: "Required",
				email: "Please enter valid email",
			},
			address: "Required",
			city: "Required",
			region: "Required",
			zipcode: {
				required: "Required",
				zipcodeUS: "Enter valid zipcode",
			},
			describe: "Required",
			topic: {
				required: "Required",
				topicSpace: "Space not allow",
			},
		},
		submitHandler: function (e) {
			const obj = {};
			$("#mslForm input, #mslForm select, #mslForm textarea").each(function (
				i,
				el
			) {
				if ($(this).val() != "") {
					obj[el.name] = $(this).val();
				}
			});

			api
				.post("msl/email-notification", obj)
				.then(function (response) {
					$(".successMess").show();
					$("body").removeClass("overflow");
					$("header, .filterBySection, .content").removeClass("blurContent");
					$(".successToHideForm").hide();
					validator.resetForm();
				})
				.catch(function (err) {
					// Error Message
				});
		},
	});

	jQuery.validator.addMethod(
		"topicSpace",
		function (value, element) {
			if ($("#topic_inquiry").val()[0] === " ") {
				return false;
			} else {
				return true;
			}
		},
		"Empty space not allow"
	);

	jQuery.validator.addMethod(
		"zipcodeUS",
		function (zipcode, element) {
			zipcode = zipcode.replace(/\s+/g, "");
			return (
				this.optional(element) ||
				(zipcode.length === 5 && zipcode.match(/^[0-9]*$/))
			);
		},
		"<br />Please specify a valid zipcode"
	);

	jQuery.validator.addMethod(
		"phoneUS",
		function (phone_number, element) {
			phone_number = phone_number.replace(/\s+/g, "");
			return (
				this.optional(element) ||
				phone_number.match(/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/)
			);
		},
		"<br />Please specify a valid phone number"
	);

	$(".celgeneMslForm .cancelStyle, .celgeneMslForm .okBtn").click(function () {
		validator.resetForm();
		$(".sectionPopup").hide();
		$("body").removeClass("overflow");
		$("header, .filterBySection, .content").removeClass("blurContent");
		//$('.successMess').hide();
	});
};

module.exports = celgeneLanding;
