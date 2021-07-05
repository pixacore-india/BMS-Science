let Registration = function (obj) {
    let container = obj.element;


    container.find("input").each(function () {
        if ($(this).val() != "") {
            $(this).parent().parent().find(".um-field-label").addClass("active");
        }
    });

    this.show = function () {
        container.show();
    };

    this.hide = function () {
        container.hide();
    };

    this.validate = function () {
        $(".emailDuplicateError").html("");
        return container.find("input").hasClass("um-error");
    };

    container.find("form").validate({
        focusCleanup: true,
        focusInvalid: false,
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        rules: {
            "first_name": {
                required: true,
                first_name: true
            },
            "last_name": {
                required: true,
                last_name: true
            },
            //"npi-3468": "required"
            // "npi":{
            //     required: true,
            //     validNPI: true
            // },
            "user_email": {
                required: true,
				validateEmail: true,
                email: true
            },
            "user_password": {
                required: true,
                passwordCheck: true
            },
            "confirm_user_password": {
                required: true,
                equalTo: "#user_password"
            },
            "Privacy[]": "required"
        },
        messages: {
            "first_name": {
                required: "Please enter your first name."
            },
            "last_name": {
                required: "Please enter your last name."
            },
            //"npi-3468": "Please enter a valid nip address"
            // "npi": {
            //     required: "Please enter a valid NPI number."
            // },
            "user_email": {
                required: "Please enter a valid email address."
            },
            "user_password": {
                required: "Please create a password."
            },
            "confirm_user_password": {
                required: "Please confirm the password.",
                equalTo: "Please enter the same password as above"
            },
            "Privacy[]": "You must agree to the privacy terms and conditions to continue."
        },
        submitHandler: function (form) {
            $(".emailDuplicateError").html("");
            const formData = {};
            $("form").serializeArray().forEach(arr => {
                switch (arr.name) {
                    case 'npi':
                        formData['npi'] = arr.value;
                        break;

                    case 'salutation':
                        formData['salutation'] = arr.value;
                        break;
                    case 'user_password':
                        formData['password'] = arr.value;
                        break;
                    case 'title':
                        formData['bs-title'] = arr.value;
                        break;
                    case 'last_name':
                        formData['last_name'] = arr.value;
                        break;
                    case 'user_email':
                        formData['email'] = arr.value;
                        break;
                    case 'first_name':
                        formData['first_name'] = arr.value;
                        break;
                    case 'redirect_to':
                        formData['redirect_to'] = arr.value;
                        break;
                }
            });
            formData.name = `${formData.first_name} ${formData.last_name}`;
            formData.username = `${formData.first_name}${formData.last_name}${Math.trunc(Math.random() * 10)}`;
            formData._wpnonce = phpData.rest_nonce;
            formData.action = "users.ajax";

            $.ajax({
                url: phpData.ajaxurl,
                data: formData,
                type: 'POST',

                success: function (res) {
                    //console.log('response', res);

                    if (res.success) {
                        window.location = formData.redirect_to;
                    } else {
                        //  console.log('err response', res);
                        $(".emailDuplicateError").html(res.data);
                    }
                }
            });

        }
    });



    container.find("form").on('blur keyup change', 'input', function (event) {
        //const isFormValid = container.find("form").valid();
        // container.find("form #um-submit-btn").prop('disabled', ! isFormValid);
        container.find("form #um-submit-btn").prop('disabled', false);
        // if(isFormValid == false){
        //     $(".emailDuplicateError").html("");
        // }
    });

    $.validator.addMethod("first_name", function (value, element) {
        return this.optional(element) || /.*\S+.*/.test(value);
    }, "Please enter your first name");

    $.validator.addMethod("last_name", function (value, element) {
        return this.optional(element) || /.*\S+.*/.test(value);
    }, "Please enter your last name");

    $.validator.addMethod("passwordCheck", function (value, element) {
        return this.optional(element) || /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/.test(value);
    }, "Password must be at least 8 characters, contain at least one special character, and at least one uppercase letter.");
    jQuery.validator.addMethod("validateEmail", function(value, element) {
        return /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value);
    }, "Please enter a valid email address.");
    // jQuery.validator.addMethod("validNPI", function(value, element) {
    //     var test = "CB"
    //     var userData;
    //     $.get( 'https://npiregistry.cms.hhs.gov/api/?number='+value+'&version=2.1', function( data ) {
    //         if(data.Errors){
    //             $('#npi-error').text(data.Errors[0].description);
    //             return false
    //         }else{
    //             var fname = data.results[0].basic.first_name.toLowerCase();
    //             var lname = data.results[0].basic.last_name.toLowerCase();

    //             if($('#first_name').value == '' && $('#last_name').value == ''){
    //                 $('#npi-error').text('Please enter first name and last name to validate NPI number.');
    //                 return false
    //             }else if($('#first_name').value == '' && $('#last_name').value != ''){
    //                 $('#npi-error').text('Please enter first name validate NPI number.');
    //                 return false
    //             }else if($('#first_name').value != '' && $('#last_name').value == ''){
    //                 $('#npi-error').text('Please enter last name validate NPI number.');
    //                 return false
    //             }else{
    //                 if(fname != $('#first_name').value && lname != $('#last_name').value){
    //                     $('#npi-error').text('First name and Last name not matching NPI number.');
    //                     return false
    //                 }else if(fname != $('#first_name').value && lname == $('#last_name').value){
    //                     $('#npi-error').text('First name not matching NPI number.');
    //                     return false
    //                 }else if(fname == $('#first_name').value && lname != $('#last_name').value){
    //                     $('#npi-error').text('Last name not matching NPI number.');
    //                     return false
    //                 }
    //             }
    //         }
    //     });
    //       return false;
    // },'')
    
};

$(document).ready(function () {
    $(".signup-hidden_label").hide();
    $(".salutation").change(function (element) {
        if (element.target.value) {
            $(".signup-hidden_label").show().css("opacity", "1");
        } else {
            $(".signup-hidden_label").hide();
        }
    });
});

module.exports = Registration;
