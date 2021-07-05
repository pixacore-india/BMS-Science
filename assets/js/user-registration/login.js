const { URL, URLSearchParams } = require( '@lvchengbin/url' );
let Login = function(obj) {
    let container = obj.element;

    var url_string = window.location.href;
    var url = new URL(url_string);
    var loginParam = url.searchParams.get("login_failed");

    if(loginParam){
        if(loginParam == "true"){
            container.find("#loginform .loginFail").show();
        }
    }else{
        container.find("#loginform .loginFail").hide();
    }

    this.show = function() {
        container.show();
    };

    this.hide = function() {
        container.hide();
    };

    container.find("input").each(function() {
        if($(this).val() != ""){
            $(this).parent().parent().find(".um-field-label").addClass("active");
        }
    });


    container.find("form#loginform").validate({
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        rules: {
            log: "required",
            pwd: "required"
        },
        messages: {
            log: "Please enter a valid email address.",
            pwd: "The password you entered is incorrect. Try again, or choose another login option."
        },
        submitHandler: function(form) {
           form.submit();
        }
    });
	
	$("#forgotForm").validate({
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        rules: {
            usernameEmail: "required"
        },
        messages: {
            usernameEmail: "Please enter a valid email address."
        },
        submitHandler: function(form) {
            container.find("#loginform .loginFail").hide();
           form.submit();
        }
    });

     

};

module.exports = Login;
