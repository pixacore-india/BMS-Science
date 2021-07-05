let User = require('./user');
let Registration = require(('./user-registration/registration'));
let Login = require(('./user-registration/login'));
let SignUp = require(('./user-registration/sign-up'));
const { URL, URLSearchParams } = require( '@lvchengbin/url' );
function UserRegistration() {
    let $ = jQuery;
    let user = phpData.userId != 0 ? new User({id: phpData.userId}) : false;


    let container = $(".signUpSection");
    container.find(".nextBtn").click(function(){
        if(views.signUp.validate()) {
            views.signUp.next();
        }
    });

    container.find(".skipStepBtn").click(function(){
        views.signUp.next(true);
    });

    container.find(".previousBtn").click(function(){
        views.signUp.prev();
    });

    container.find(".finishBtn").click(function(e) {
        e.preventDefault();
        views.signUp.submit();
    });

    let views = {
        register: new Registration({
            element: $(".signupContent")
        }),
        login: new Login({
            element: $(".loginContent")
        }),
        signUp: new SignUp({
            element: $(".signupStepProcess")
        }),

        switchState: function() {
            this.register.hide();
            this.signUp.show();
            $("body").addClass("overflow");
        }
    };

    function init() {
        let urlParams = new URLSearchParams(window.location.search);
        if(user && urlParams.has('new')) {
            show();
            views.switchState();
        }

        if(urlParams.has('login_failed')) {
            $(".login a").click();
        }

    }

    function show() {
        container.fadeIn();
    }

    init();
}

module.exports = UserRegistration;
