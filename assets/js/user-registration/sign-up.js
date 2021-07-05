let Specialty = require('./sign-up/specialty');
let SubSpecialty = require('./sign-up/sub-specialty');
let TrialOfInterest = require('./sign-up/trial-of-interest');
let DrugIntervention = require('./sign-up/drug-intervention');
let API = require("../api");

let SignUp = function (obj) {
    let container = obj.element;
    let currentView = "specialty";
    let self = this;
    let api = new API();
    let specialtySkipped = false;

    let views = {
        specialty: new Specialty({
            element: container.find(".step1"),
            key: "specialties"
        }),
        subSpecialty: new SubSpecialty({
            element: container.find(".step2"),
            key: "subSpecialties"
        }),
        trialOfInterest: new TrialOfInterest({
            element: container.find(".step3"),
            key: "trials_of_interest"
        }),
        drugIntervention: new DrugIntervention({
            element: container.find(".step4"),
            key: "interventions"
        })
    };

    this.show = function () {
        container.fadeIn();
        stepSlider = $('#stepSlider').bxSlider({
            mode: 'vertical',
            infiniteLoop: false,
            hideControlOnEnd: true,
            pager: false,
            auto: false,
            pause: 10000,
            controls: false,
            touchEnabled: false,
            onSlideAfter: function (currentSlide, oldIndex, newIndex) {
                updateTimeline(newIndex);

                currentView = Object.keys(views)[newIndex];
            },
            onSlideBefore: function (currentSlide, oldIndex, newIndex) {
                update(newIndex);
            }
        });
    };

    this.validate = function () {
        let validateCurrentView = views[currentView].validate();
        if (validateCurrentView) {
            return validateCurrentView;
        }

        showErrorMessage();
    };

    this.next = function (isSkip) {
        clearErrorMessage();
        
        if(isSkip && views[currentView].shouldSkip) {
            let currentIndex = Object.keys(views).indexOf(currentView);
            //console.log("current", currentIndex);
            
            if(currentIndex == 2){
                views[currentView].setSkip(true);
                stepSlider.goToSlide(currentIndex+1);
            }else{
                stepSlider.goToSlide(currentIndex+2);
                views[Object.keys(views)[currentIndex+2]].setSkip(true);
            }
            
        } else {
           stepSlider.goToNextSlide();
        }
    };

    this.prev = function () {
        if(views[currentView].shouldSkip) {
            views[currentView].setSkip(false);

            let currentIndex = Object.keys(views).indexOf(currentView);
            stepSlider.goToSlide(currentIndex-2);
        } else {
            stepSlider.goToPrevSlide();
        }
    };

    this.submit = function () {
        let data = {};
        for (let key in views) {
            let view = views[key];
            data[view.key] = view.action();
        }

        api.post("user/" + phpData.userId + "/save-profile", data).then(function (response) {
            response = JSON.parse(response);
            window.location.href = response.redirect_url;
        });
    };

    function update(newIndex) {
        if (typeof views[currentView].onChange == "function") {
            views[currentView].onChange(views);
        }

        container.attr("data-slide", newIndex);
    }

    function showErrorMessage() {
        container.find(".errorMsg").html(views[currentView].getErrorMessage());
    }

    function clearErrorMessage() {
        container.find(".errorMsg").html("");
    }

    function updateTimeline(index) {
        container.find(".progress li").removeClass("active");
        container.find(".progress li").removeClass("highlight");

        for (let i = 0; i < index; i += 1) {
            container.find('li[data-step="' + (i + 1) + '"]').addClass("active");
        }

        container.find('li[data-step="' + (index + 1) + '"]').addClass("highlight");
    }
};

module.exports = SignUp;
