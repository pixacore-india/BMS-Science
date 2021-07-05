let BMSAccordion = function(obj) {
    const container = obj.container;
    const linkEl = obj.openLink;
    const accordionEl = obj.accordionComponent;
    let activeEl = obj.activeEl
    let activeElName = activeEl.selector.replace('#','');

    // activeEl.addClass('active');
    activeEl.slideDown();
    container.find('[data-accordion='+activeElName+']').addClass('active');
        linkEl.on('click', function(){
        let activeEl = $(this).attr('data-accordion');
        if($(this).hasClass('active')){
            $(this).removeClass('active');
            $('#'+activeEl).slideUp();
            // $('#'+activeEl).removeClass('active');
        }else{
            // linkEl.removeClass('active');
            // accordionEl.slideUp();
            // accordionEl.removeClass('active');
            $(this).addClass('active');
            $('#'+activeEl).slideDown();
            // $('#'+activeEl).addClass('active');
            // console.log($('#'+activeEl).position().top)
            $('html, body').animate({ scrollTop: $('#'+activeEl).offset().top - 140}, 'slow');
        }
    });

    container.find('.tarea-list').find('input[type="checkbox"]').on('change', function(){
        let selectCount = 0;
        container.find('.tarea-list').find('input[type="checkbox"]:checked').each(function(){
            selectCount = selectCount + 1;            
        });
        if(selectCount > 0){
            container.find('[data-accordion="theraupeticArea"]').text('THERAPEUTIC AREA ('+selectCount+')');
        }else{
            container.find('[data-accordion="theraupeticArea"]').text('THERAPEUTIC AREA');
        }
    })
    
}
module.exports = BMSAccordion;