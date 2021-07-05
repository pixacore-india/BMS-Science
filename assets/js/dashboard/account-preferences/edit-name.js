require('jqueryValidator');
let API = require("../../api");

let EditName = function(obj) {
    const container = obj.element;
    const api = new API();

    container.find('.changePassword').click(function(){
        container.find('#current_password').val("");
        $(this).parents('li').find('.currentPasswordBx').hide();
        $(this).parents('li').find('.newPasswordBx').show();
        $(this).parents('form').find('.buttonSection .okBut').prop('disabled', true).addClass('disabled');
        return false;
    });

    container.find("form").on('blur keyup keydown  change', function(event) {
        const isFormValid = container.find("form").valid();
        container.find("form .okBut").prop('disabled', ! isFormValid);
        container.find("form .okBut").toggleClass('disabled', ! isFormValid);
    });
	
	container.find(".editIcon").on('click', function(event) {
		$(this).parents('.popoverBut').find('.popoverContainer').slideDown();
		return false;
	 });

    container.find("form").validate({
        rules: {
            first_name: "required",
            last_name: "required",
            user_email: {
                required: true,
				validateEmail: true,
                email: true
            },
            user_pass: {
                required: true,
                // passwordCheck: true,
                // minlength: 8
            },
            current_password: {
                required: true,
                // passwordCheck: true,
                // minlength: 8
            },
            new_password: {
                required: true,
                passwordCheck: true,
                minlength: 8
            },
            new_password_confirm: {
                required: true,
                equalTo: "#new_password"
            }
        },
        messages: {
            first_name: "Please enter your firstname",
            last_name: "Please enter your lastname",
            user_email: "Please enter a valid email address",
            user_pass: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
            },
            current_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
                
            },
            new_password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 8 characters long"
            },
            new_password_confirm: {
                required: "Please provide a password",
                equalTo: "Please enter the same password as above"
            }
        },
        submitHandler: function() {
            saveUserProfile();
        }
    });


    saveUserProfile = () => {
        const obj = {};
        container.find("form input").each(function(i, el){
            const isInputVisible = $(this).is(":visible");
            if(isInputVisible) {
                obj[el.name] = $(this).val();
            }
        });

        container.find("form select").each(function(i, el){
            const isInputVisible = $(this).is(":visible");
            if(isInputVisible) {
                obj[el.name] = $(this).val();
            }
        });

        api.post(`user/${phpData.userId}/update-account`, obj).then(function(response) {
            //console.log(response);
            var responseId = response[Object.keys(response)[0]];
            var message = response[Object.keys(response)[2]];
            if(responseId == 200){
                container.find('.accountEditPopup').slideUp();
				location.reload();
            }else{
                container.find("#current_password").removeClass('valid');
                container.find("#current_password").addClass('error');
                container.find("#current_password-error").show();
                container.find("#current_password-error").html(message);
                container.find('#current_password').val("");
            }


        }).catch(function(err) {
            //console.log(err);
            container.find("#current_password").removeClass('valid');
            container.find("#current_password").addClass('error');
            container.find("#current_password-error").show();
            container.find("#current_password-error").html("Incorrect Password");
            container.find('#current_password').val("");
        });
    };

    jQuery.validator.addMethod("passwordCheck", function(value, element) {
        return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value);
    },"Password must be at least 8 characters, contain at least one special character, and at least one uppercase letter.");
	
	jQuery.validator.addMethod("validateEmail", function(value, element) {
        return /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
	}, "Please enter a valid email address.");
	
};

module.exports = EditName;