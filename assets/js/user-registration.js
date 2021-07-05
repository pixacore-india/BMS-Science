let API = require('./api');
let User = require('./user');
const { URL, URLSearchParams } = require( '@lvchengbin/url' );
function UserRegistration() {
    let $ = jQuery;

    let container;
    let self = this;
    let api = new API();
    let user = phpData.userId != 0 ? new User({id: phpData.userId}) : false;
    let stepSlider;
    var slide_curr;

    let states = {
        register: {
            container: ".signupContent",
            submit: function() {
                let inputs = getFormInputs($(this.container).find("form"));

                return api.post('/wp-json/wp/v2/users/register', {
                    username: inputs.user_email,
                    email: inputs.user_email,
                    password: inputs.user_password
                });
            },
            hide: function() {
                $(this.container).hide();
            }
        },
        stepProcess: {
            container: ".signupStepProcess",
            steps: [
                {
                    //specialty
                    container: ".step1",
                    key: "specialties",
                    action: function() {
                        let selectedSpecialties = [];
                        $(this.container).find("li.active").each(function(){
                            selectedSpecialties.push({
                                id: $(this).data('id'),
                                val: $(this).text()
                            });
                        });

                        return selectedSpecialties;
                    },
                    onChange: function() {
                        states.stepProcess.steps[1].setContent(this.action());
                    }
                },
                {
                    //sub specialty
                    container: ".step2",
                    key: "subSpecialties",
                    action: function() {
                        let subSpecialties = [];
                        $(this.container).find("li.active").each(function(){
                            subSpecialties.push($(this).data('id'));
                        });

                        return subSpecialties;
                    },
                    setContent: function(specialties) {
                        $(this.container).find(".twoParts[data-id]").hide();
                        for(let i=0; i<specialties.length; i++) {
                            let specialty = specialties[i];
                            $(this.container).find("[data-id=" + specialty.id + "]").show();
                        }
                    }
                },
                {
                    //trial of interest
                    container: ".step3",
                    key: "trials_of_interest",
                    action: function() {
                        let data = {};
                        $(container).find("[name]").each(function() {
                            data[$(this).attr("name")] = $(this).val();
                        });

                        return data;
                    }
                },
                {
                    //drug intervention
                    container: ".step4",
                    key: "interventions",
                    action: function() {
                        let interventions = [];
                        $(this.container).find(".intervention").each(function() {
                            if($(this).val()) {
                                interventions.push($(this).val());
                            }
                        });

                        return interventions;
                    }
                }
            ],

            show: function() {
                $(this.container).fadeIn();
                stepSlider = $('#stepSlider').bxSlider({
                    mode: 'vertical',
                    infiniteLoop: false,
                    hideControlOnEnd: true,
                    pager: false,
                    auto: false,
                    pause: 10000,
                    controls: false,
                    touchEnabled: false,
                    onSlideAfter: function (){
                        slide_curr = stepSlider.getCurrentSlide();
                        states.updateTimeline(slide_curr);
                    },
                    onSlideBefore: function (currentSlide, oldIndex, newIndex) {
                        let prevSlide = $(".step" + (oldIndex+1));
                        states.stepProcess.update(prevSlide, oldIndex, newIndex);
                    },
                    onSliderLoad: function () {
                        setTimeout(function(){ 
                            slide_curr = stepSlider.getCurrentSlide();
                         }, 10);
                    }
                });
            },
            update: function(prevSlide, oldIndex, newIndex) {
                $(this.container).attr("data-slide", newIndex);
                if(prevSlide.hasClass("cActionOC")) {
                    this.steps[oldIndex].onChange();
                }
            },
            next: function() {
                stepSlider.goToNextSlide();
            },
            prev: function() {
                stepSlider.goToPrevSlide();
            },
            submit: function() {
                let data = {};
                for(let i=0; i<this.steps.length; i++) {
                    let step = this.steps[i];
                    data[step.key] = step.action();
                }

                api.post("/wp-json/boldsci/v1/user/"+user.getId()+"/save-profile", data).then(function(response) {
                    response = JSON.parse(response);
                    window.location.href = response.redirect_url;
                });
            }
        },

        switchState: function() {
            this.register.hide();
            this.stepProcess.show();
        },
        updateTimeline: function(index){
            $(".progress li").removeClass("active");
			$(".progress li").removeClass("highlight");
			for (let i = 0; i < index; i += 1) {
				$('li[data-step="'+(i+1)+'"]').addClass("active");
				$('li[data-step="'+(i+2)+'"]').addClass("highlight");
			}

        }

    };

    this.init = function() {
       
        container = $(".signUpSection");
        /*container.find(".signupContent form").submit(function(e) {
            e.preventDefault();
            states.register.submit().then(function(response) {
                console.log(response);
                user = new User({
                    id: response.user_id
                });
                states.switchState();
            });
        });*/

        container.find(".nextBtn").click(function(){
            if(slide_curr == 0){
                if($(".step1 .specialityContent ul li").hasClass("active") == false){
                    $(this).css("color","rgba(255,255,255,0.5)");
                    $(".signupStepProcess .errorMsg").html("select atleast one specialities");
					return false;
				}else{
					$(this).css("color","white");
                    states.stepProcess.next();
                    $(".signupStepProcess .errorMsg").html("");
				}
            }
            else if(slide_curr == 1){
                if($(".step2 .specialityContent ul li").hasClass("active") == false){
                    $(this).css("color","rgba(255,255,255,0.5)");
                    $(".signupStepProcess .errorMsg").html("select atleast one sub specialities");
					return false;
				}else{
					$(this).css("color","white");
                    states.stepProcess.next();
                    $(".signupStepProcess .errorMsg").html("");
				}
            }else{
                states.stepProcess.next();
            }
            
        });

        container.find(".skipStepBtn").click(function(){
            states.stepProcess.next();
            $(".signupStepProcess .errorMsg").html("");
        });

        container.find(".previousBtn").click(function(){
            states.stepProcess.prev();
            $(".signupStepProcess .errorMsg").html("");
        });

        container.find(".finishBtn").click(function(e) {
            e.preventDefault();
            states.stepProcess.submit();
        });

        let urlParams = new URLSearchParams(window.location.search);
        if(user && urlParams.has('new')) {
            this.show();
            states.switchState();
        }
    };

    this.show = function() {
        container.fadeIn();
    };

    function getFormInputs(form) {
        let inputs = {};

        form.find( '[name]' ).each( function( i , v ){
            let input = $( this ), // resolves to current input element.
                name = input.attr( 'name' );
            inputs[name] = input.val();
        });

        return inputs;
    }
}

module.exports = UserRegistration;
