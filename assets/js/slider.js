require('bxSlider');

let Slider = function(obj) {
    let page = obj.page;
    let slider;


    slider = $('#stepSlider').bxSlider({
        mode: obj.orientation,
        infiniteLoop: false,
        hideControlOnEnd: true,
        pager: false,
        auto: false,
        pause: 10000,
        controls: false,
        touchEnabled: false,
        onSlideAfter: function () {
            slide_curr = stepSlider.getCurrentSlide();
            moveSlider(slide_curr);
        },
        onSliderLoad: function () {
            $(".nextBtn").show();
            $(".previousBtn, .finishBtn").hide();
        }
    });
};

modules.export = Slider;