const Filter = require("./bms/filter");
const ViewAll = require("./bms/view-all");
const TherapeuticArea = require("./bms-science/filters/views/therapeuticArea");
const DiseaseArea = require("./bms-science/filters/views/diseaseArea");
const UTILITY = require("./utility");

const BMSTrials = function (obj) {
    
    const { container } = obj;
    let output = container.find('.output');
    const views = {
        trialFilter: new Filter({
            container: container.find(".trialContainer"),
            filter: ".trialItem",
            type: "checkbox",
            inputContainer: container.find(".trialFilter"),
            relation: "AND",
            // childInputContainer: false,
            getViews: function () {
                return views;
            }
        }),
        therapeuticAreaFilter: new Filter({
            container: container.find(".therapeuticAreasContainer"),
            filter: ".therapeuticAreasItem",
            type: "checkbox",
            inputContainer: container.find(".therapeuticAreaFilter"),
            relation: "OR",
            // childInputContainer: container.find(".trialFilter"),
            getViews: function () {
                return views;
            }
        }),
        deseasesAreasFilter: new Filter({
            container: container.find(".cardContainer"),
            filter: ".card",
            type: "checkbox",
            inputContainer: container.find(".deseasesAreasFilter"),
            relation: "OR",
            // childInputContainer: container.find(".trialFilter"),
            getViews: function () {
                return views;
            }
        }),

        therapeuticArea: new TherapeuticArea({
            container: container.find(".taFilterWrapper"),
            getViews: function () {
                return views;
            }
        }),
        diseaseArea: new DiseaseArea({
            container: container.find(".daFilterWrapper"),
            getViews: function () {
                return views;
            }
        }),

        viewAll: [],

        refreshFilters: function () {
            this.trialFilter.refresh();
            this.therapeuticAreaFilter.refresh();
            this.deseasesAreasFilter.refresh();
            setTimeout(() => {
                this.trialFilter.refresh();
                this.therapeuticAreaFilter.refresh();
                this.deseasesAreasFilter.refresh();
                // $('.phaseContainer').each(function(){
                //     $(this).find('.phaseItem').removeClass('no-brd-btm');
                //     $(this).find('.phaseItem:visible:last').addClass('no-brd-btm');
                // });
            }, 100);
            setTimeout(function() { 
                let nctCount = [];
                let partners = [];
                // console.log(container.find('.cardContainer:visible').length);
                container.find('.cardContainer:visible .card:visible .phaseRow.selectedItem').each(function (){
                    let nctids = $(this).data('nctids').split(',');
                    // console.log(nctids);
                    for(let n = 0; n < nctids.length; n++){
                        nctCount.push(nctids[n]);
                    }
                    
                    if($(this).attr('data-partner') != '') {
                        partners.push($(this).attr('data-partner'));
                    }
                    // console.log(nctCount);
                })
                function getUnique(array){
                    var uniqueArray = [];
                    for(let i=0; i < array.length; i++){
                        if(uniqueArray.indexOf(array[i]) === -1) {
                            uniqueArray.push(array[i]);
                        }
                    }
                    return uniqueArray;
                }
                let uniqueNames = getUnique(nctCount);
                // console.log(uniqueNames);
                let count = uniqueNames.length;
                // console.log('count bms-trial', count);
                if(count != 1){
                    $('.trial-count').text('Displaying '+count+' trials');
                }else{
                    $('.trial-count').text('Displaying '+count+' trial');
                }
                
                $('.page-template-bms-pipeline-trial .pipeline-ref li').hide(); 
                $('.page-template-bms-pipeline-trial .pipeline-ref p').hide(); 
                if(partners.length > 0) {
                    partners.map((value) => {
                        $('.page-template-bms-pipeline-trial .pipeline-ref li').each(function() {
                            if($(this).hasClass(value)) {
                                $(this).show();
                                $('.page-template-bms-pipeline-trial .pipeline-ref p').show(); 
                            }      
                        })
                    });
                }

            }, 1000);
        },

        setViewsInChildren: function () {
            this.trialFilter.setViews();
            this.therapeuticAreaFilter.setViews();
            this.deseasesAreasFilter.setViews();
            this.therapeuticArea.setViews();
            this.diseaseArea.setViews();

            this.viewAll.forEach(function (view) {
                view.setViews();
            })
        },
    };

    container.find(".cardContainer .card").each(function () {
        let da = $(this).attr("data-da");
        const ta = $(this).parents(".therapeuticAreasItem").attr("data-ta");
        views["viewAll"][`${ta}-${da}`] = new ViewAll({
            container: $(this),
            onViewAll: function () {
                views.refreshFilters();
            },
            getViews: function () {
                return views;
            }
        });
    });
    container.find('.nct-popup').on('click', function () {
        // console.log($(this).parent().parent().next('.hidden').find('.modal-content'))
        let dataShow = '.' + $(this).data('view');
        $(this).parent().parent().next('.hidden').find('.modal-content').find('li').addClass('hidden');
        $(this).parent().parent().next('.hidden').find('.modal-content').find(`li${dataShow}`).removeClass('hidden');
        let content = $(this).parent().parent().next('.hidden').find('.modal-content').clone();
        $("#myVideoModal .modal-dialog").empty();
        let closeBtn = '<button type="button" class="close" data-dismiss="modal">&nbsp;</button>'
        $("#myVideoModal .modal-dialog").append(closeBtn);
        $("#myVideoModal .modal-dialog").append(content);
    })

    container.find("input[type='checkbox']").change(function () {        
        let selctedTa = ''
        const triggerEvent = $(this).attr("data-triggerEvent");
        if(triggerEvent) {
            $(this).trigger(triggerEvent);
        }
        if(triggerEvent == 'ta-changed'){
            if($(this).is(":not(:checked)")){
                container.find('.clearThraupeticDiesese').removeClass('active');
            }
        }
        const filter = $(this).attr("name");
        let values = [];
        container.find(`input[name='${filter}']:checked`).each(function () {
            selctedTa = $(this).parent().parent().parent().attr('data-ta');
            if(!$(this).hasClass("skipValue")) {
                values.push($(this).val());
                if($(this).attr('name') != 'filter_phase' && $(this).attr('name') != 'filter_status'){
                    if($(this).attr('name')=='filter_specialty'){
                        $(this).parent().parent().find('.clearThraupeticDiesese').addClass('active');
                    }else{
                        $(this).parent().parent().parent().parent().find('.clearThraupeticDiesese').addClass('active');
                    }
                    
                }
            }
        });
        if(values.length == 0 && !$(this).hasClass("skipValue")){
            container.find('.clearThraupeticDiesese').removeClass('active');
        }
        if (isMobilePortrait()) {
            return false;
        }
        console.log(filter)
        UTILITY.updateQueryString(location.href, filter, values.join(","));

        resetFilter();
        createFilterBtn();
    });

    container.find("input.trial-search-input").on('input', function () {
        let inVal = $(this).val();
        inVal = inVal.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        if (inVal.length > 2) {
            if ($(`#dieses li:contains(${inVal})`).length) {
                // console.log($(`#dieses li:contains(${inVal})`).length)
                deseaseDisable();
                container.find('#dieses').slideDown();
                $(`#dieses li:contains(${inVal})`).show();
                $(this).addClass('focus');
                container.find('#dieses li.not-found').hide();
            } else {
                // container.find('#dieses').slideUp();
                // container.find('#dieses li').hide();

                container.find('#dieses').slideDown();
                container.find('#dieses li').hide();
                container.find('#dieses li.not-found').show();
                $(this).addClass('focus');
            }
        } else {
            container.find('#dieses').slideUp();
            container.find('#dieses li').hide();
            container.find('#dieses li.not-found').hide();
            $(this).removeClass('focus');
        }
        if (inVal.length > 0) {
            $('.pipeline-search').addClass('active');
        }else{
            $('.pipeline-search').removeClass('active');
        }
        // const selector = $(`#dieses [value="${value}"]`).data('selector');

        // container.find(`input[value='.${selector}']`).trigger('click');
    });
    container.find("input.trial-search-input").on('focus', function () {
        // alert(1);
        let inVal = $(this).val();
        inVal = inVal.toLowerCase().replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
        if (inVal.length > 2) {
            if ($(`#dieses li:contains(${inVal})`).length) {
                deseaseDisable();
                container.find('#dieses').slideDown();
                $(`#dieses li:contains(${inVal})`).show();
                $(this).addClass('focus');
            } else {
                container.find('#dieses').slideUp();
                container.find('#dieses li').hide();
                $(this).removeClass('focus');
            }
        } else {
            container.find('#dieses').slideUp();
            container.find('#dieses li').hide();
            $(this).removeClass('focus');
        }        
    });
    $('.pipeline-search').on('click', function(){
        container.find("input.trial-search-input").val('');
        $(this).removeClass('active');
    })
    $(document).on('click', function(event){
        if (!$(event.target).closest("input.trial-search-input").length && !$(event.target).closest("button.search-btn").length) {
            container.find('#dieses').slideUp();
            container.find('#dieses li').hide();
            container.find("input.trial-search-input").removeClass('focus');
        }
    })
    $('#topTheraupeticareaList li img, #topTheraupeticareaList li a, #topTheraupeticareaList li h3').on('click', function () {
        let selector = $(this).parents('li').data('target');
        const input = container.find(`input[value='.${selector}']`);
        if(!input.is(":checked")) {
            if (input.attr("data-triggerEvent") && input.attr("data-triggerEvent") == "ta-changed") {
                container.find(`input[name="desease"]`).filter(`[value='${selector}']`).trigger("click");
            }
            container.find(`input[value='.${selector}']`).trigger('click');
        }
        if (isMobile()) {
            location.reload();
        }
    });
    container.find('#dieses li').on('click', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        let selector = $(this).data('selector');
        const input = container.find(`input[value='.${selector}']`);

        if(!input.is(":checked")) {
            if (input.attr("data-triggerEvent") && input.attr("data-triggerEvent") == "ta-changed") {
                container.find(`input[name="desease"]`).filter(`[value='${selector}']`).trigger("click");
            }

            container.find(`input[value='.${selector}']`).trigger('click');
        }
        container.find("input.trial-search-input").val('');
        $('.pipeline-search').removeClass('active');
        container.find('#dieses').slideUp();
        container.find('#dieses li').hide();
        resetFilter();
        createFilterBtn();
    });
    function deseaseDisable(){  
        $('.trials-section .filterPillsSelected a').each(function(){
            if(!$(this).hasClass('clearAllLink')){
                var myVal = $(this).attr('value');
                myVal = myVal.replace('.','');
                container.find('#dieses li').each(function(){
                    if(($(this).attr('data-selector') == myVal || $(this).attr('data-parentselector') == myVal) && myVal != undefined){
                        $(this).addClass('disabled');
                    }else{
                        $(this).removeClass('disabled');
                    }
                });
            }
        });
    }
    deseaseDisable();
    container.find(".closeFilter").on('click', function () {
        if (isDesktop()) {
            return false;
        }
        container.find(".cancelFilter").trigger('click');
    })
    container.find(".cancelFilter").on('click', function () {
        if (isDesktop()) {
            return false;
        }
        let selectedInputs = [];
        selectedInputs = selectedInputs.concat(views.trialFilter.getSelectedInputs())
            .concat(views.therapeuticAreaFilter.getSelectedInputs())
            .concat(views.deseasesAreasFilter.getSelectedInputs());

        if (selectedInputs.length) {
            for (let i = 0; i < selectedInputs.length; i++) {
                let value = selectedInputs[i];
                container.find(`input[type='checkbox'][value='${value}']`).addClass("selected-inputs");
            }
        }
        container.find("input[type='radio']").not(".selected-inputs").prop("checked", false);
        container.find("input[type='checkbox']").not(".selected-inputs").prop("checked", false);
        setTimeout(function () {
            $(".selected-inputs").prop("checked", true).removeClass("selected-inputs");
        }, 2);

        views.therapeuticArea.show();
        views.diseaseArea.hide();

        container.find('.clearThraupeticDiesese').removeClass('active');
        
        const filters = ['filter_specialty', 'filter_celgene_da'];
        for(let i=0; i<filters.length; i++) {
            const filter = filters[i];
            let values = [];
            container.find(`input[name='${filter}']:checked`).each(function () {
                if(!$(this).hasClass("skipValue")) {
                    values.push($(this).val());
                }
            });
            UTILITY.updateQueryString(location.href, filter, values.join(","));
        }

        resetSkipValue();
        resetFilter();
        createFilterBtn();
    });

    container.find(".applyFilter").click(function () {
        if (isDesktop()) {
            return false;
        }
        let deseasesAreasFiltervalues = [];
        let deseasesAreasFilter = '';
        let phaseFilterFiltervalues = [];
        let phaseFilterFilter = '';
        let statusFiltervalue = [];
        let statusFilter='';
        let MydeseaseVal = ''

        container.find(`.disease-area-filter input[type=checkbox]:checked`).each(function () {
            let ckbxLngth = $(this).parents('.disease-area-filter').find('input[type=checkbox]').length;
            let ckbxckdLngth = $(this).parents('.disease-area-filter').find('input[type=checkbox]:checked').length;
            if(ckbxckdLngth < ckbxLngth){
                deseasesAreasFilter = $(this).attr('name');
                deseasesAreasFiltervalues.push($(this).val());
            }else{
                deseasesAreasFilter = $(this).parents('.disease-area-filter').siblings('.therapeutic-area-filter').find('input[type=checkbox]:checked').attr('name');
                // console.log(MydeseaseVal)
                if(MydeseaseVal != $(this).parents('.disease-area-filter').siblings('.therapeutic-area-filter').find('input[type=checkbox]:checked').val()){
                    MydeseaseVal = $(this).parents('.disease-area-filter').siblings('.therapeutic-area-filter').find('input[type=checkbox]:checked').val();
                    deseasesAreasFiltervalues.push($(this).parents('.disease-area-filter').siblings('.therapeutic-area-filter').find('input[type=checkbox]:checked').val());
                }
            }
            
        });
        container.find(`.phaseFilter input[type=checkbox]:checked`).each(function () {
            phaseFilterFilter = $(this).attr('name');
            phaseFilterFiltervalues.push($(this).val());
        });
        container.find(`.statusFilter input[type=checkbox]:checked`).each(function () {
            statusFilter = $(this).attr('name');
            statusFiltervalue.push($(this).val());
        });
        UTILITY.updateQueryString(location.href, deseasesAreasFilter, deseasesAreasFiltervalues.join(","));
        UTILITY.updateQueryString(location.href, phaseFilterFilter, phaseFilterFiltervalues.join(","));
        UTILITY.updateQueryString(location.href, statusFilter, statusFiltervalue.join(","));
        container.find('.filterPills input:radio').prop("checked", false);
        $('.deseases').show();
        $('.diesesAreas').hide();
        $('.thearepeticAreas').hide();
        resetFilter();
        createFilterBtn();
    });

    container.find('.resetfilter').on('click', function () {
        output.html("");
        container.find('.filterPills input:radio').prop("checked", false);
        container.find('.filterPills input:checkbox').prop("checked", false);
        const urlParams = UTILITY.getParamsByPrefix("filter_");
        for (let name in urlParams) {
            UTILITY.updateQueryString(location.href, name, "");
        }
        resetSkipValue();
        resetFilter();
        createFilterBtn();
    });

    container.on("click", ".clearAllLink", function () {
        container.find('input:radio').prop("checked", false);
        container.find("input:checkbox").prop("checked", false);
        const urlParams = UTILITY.getParamsByPrefix("filter_");
        for (let name in urlParams) {
            UTILITY.updateQueryString(location.href, name, "");
        }
        $('.deseases').slideDown('slow');
        $('.thearepeticAreas').slideUp('slow');
        $('.deseases').find('input[type="radio"]').prop('checked', false);

        resetSkipValue();
        resetFilter();
        createFilterBtn();
    });

    //clearThraupeticDiesese

    container.find('.clearThraupeticDiesese').on('click', function () {
        $(this).removeClass('active');
        $(this).parent().parent().parent().find('.deseasesAreasFilter input:checkbox').prop('checked', false);
        // container.find('input:radio').prop("checked", false);
        // container.find("input:checkbox").prop("checked", false);

        const filters = ['filter_specialty', 'filter_celgene_da'];
        for(let i=0; i<filters.length; i++) {
            const filter = filters[i];
            let values = [];
            container.find(`input[name='${filter}']:checked`).each(function () {
                if(!$(this).hasClass("skipValue")) {
                    values.push($(this).val());
                }
            });
            UTILITY.updateQueryString(location.href, filter, values.join(","));
        }

        resetSkipValue($(this));
        resetFilter();
        createFilterBtn();
    });

    container.on("click", ".removeFilter", function () {
        $(this).remove();
        let removeItemArray = $(this).attr("value");
        container.find(`input[value="${removeItemArray}"]`).prop("checked", false);
        const name = container.find(`input[value="${removeItemArray}"]`).attr("name");
        container.find('#dieses').find(removeItemArray).removeClass('disabled');
        let slected = removeItemArray.replace('.','');
        // console.log(slected)
        $('.disease-area-filter[data-ta="'+slected+'"]').find('input[type="checkbox"]').prop('checked', false);
        // UTILITY.updateQueryString(location.href, name, "");
        let values = [];
        container.find(`input[name='${name}']:checked`).each(function () {
            values.push($(this).val());
        });
        UTILITY.updateQueryString(location.href, name, values.join(","));
        resetFilter();
        if ($('.removeFilter').length < 1) {
            $('.clearAllLink').remove();
        }
    });

    $(window).resize(function () {
        if (isMobile()) {
            // return;
        }

        resetFilter();
    });

    function resetSkipValue(ele) {
        console.log(ele);
        if(ele != undefined) {
            ele.parent().parent().find('.disease-area-filter').find('.skipValue').removeClass("skipValue");
        } else {
            $(".skipValue").removeClass("skipValue");
        }
    }

    function resetFilter() {
        // resetViews();

        views.trialFilter.setFilters();
        views.therapeuticAreaFilter.setFilters();
        views.deseasesAreasFilter.setFilters();

        setTimeout(function() {
            refreshViews();
        }, 50);
    }

    function createFilterBtn() {
        output.html("");
        let selectedInputs = [];
        selectedInputs = selectedInputs.concat(views.trialFilter.getSelectedValues())
            .concat(views.therapeuticAreaFilter.getSelectedValues("update-container"))
            .concat(views.deseasesAreasFilter.getSelectedValues("update-da-container"));


        selectedInputs = selectedInputs.filter((input, index, self) =>
            index === self.findIndex((t) => (
                t.attr("value") === input.attr("value")
            ))
        );

        for (let i = 0; i < selectedInputs.length; i++) {
            let buttons = selectedInputs[i];
            buttons.appendTo(output);
        }

        if (selectedInputs.length) {
            const cancelBT = $(`<div class="clearfix visible-sm visible-xs"></div><a href="javascript:;" class="clearAllLink">Clear all</a>`);
            cancelBT.appendTo(output);
            setTimeout(function() {
                let posTop = $('#trialList').position().top - $('header').height();
                $("html, body").animate({ scrollTop: posTop }, "slow");
            },1500);
        }
    }

    function refreshViews() {
        let selectedTrials = views.trialFilter.getSelectedInputs();
        let selectedTA = views.therapeuticAreaFilter.getSelectedInputs();
        let selectedDA = views.deseasesAreasFilter.getSelectedInputs();

        if(selectedTA.length) {
            selectedTA.map(function (ta) {
                let values = ta.split(".");
                for(let i=1; i<values.length; i++) {
                    const value = "." + values[i];
                    const taItem = container.find(`${value}.therapeuticAreasItem`);
                    if(taItem.attr("data-ta") == value.slice(1)) {
                        taItem.find(".card").each(function () {
                            const da = $(this).attr("data-da");
                            selectedDA.push(`.${da}`);
                        });
                    }
                }
            });
        }

        let cardViews = views.viewAll;

        if (selectedDA.length) {
            cardViews = [];
            selectedDA.map(function (da) {
                const ta = container.find(`.card${da}`).parents(".therapeuticAreasItem").attr("data-ta");
                cardViews[`${ta}-${da.slice(1)}`] = views.viewAll[`${ta}-${da.slice(1)}`];
            });
        }

        for (let da in cardViews) {
            if (!cardViews[da]) {
                continue;
            }
            cardViews[da].resetParent();
        }

        let isEmpty = true;
        let firstDAAvailable = '';
        let taKey = [];
        for (let da in cardViews) {
            if (!cardViews[da]) {
                continue;
            }

            let ta = da.split("-")[0];
            taKey[ta] = da;

            if (!firstDAAvailable) {
                firstDAAvailable = da;
            }
            if (!cardViews[da].update(selectedTrials, selectedDA)) {
                isEmpty = false;
                // if ($(".cardNoResult").hasClass('bms-trials-noResult-show')) {
                //     $(".trialContainerP").show();
                //     $(".cardNoResult").removeClass('bms-trials-noResult-show');
                // }
            }
        }

        for(let ta in taKey) {
            cardViews[taKey[ta]].toggleParent();
        }

        if (isEmpty) {
            if(views.viewAll[firstDAAvailable]) {
                views.viewAll[firstDAAvailable].showEmptyMessage();
            } else {
                ViewAll.showEmptyMessage();
            }
        } else {
            ViewAll.hideEmptyMessage();
        }

        views.refreshFilters();
    }
    function isIpad() {
        return $(window).width() > 768;
    }
    function isDesktop() {
        return $(window).width() > 991;
    }

    function isMobile() {
        return $(window).width() < 992;
    }
    function isMobilePortrait() {
        return $(window).width() < 768;
    }


    views.setViewsInChildren();
    if (Object.keys(UTILITY.getParamsByPrefix(("filter_"))).length) {
        resetFilter();
        createFilterBtn();
    } else {
        views.refreshFilters();
    }
    
    $(window).on('popstate load', function(event) {
        // if (Object.keys(UTILITY.getParamsByPrefix(("filter_"))).length) {
            resetFilter();
            createFilterBtn();
        // } else {
        //     views.refreshFilters();
        // }
    });


   
    let filterPanel = container.find('.filter-area');
    let stickyMUP = 0;
    let scrollPos = 0;
    let filterTopHgt = filterPanel.find('.filter-top-content').height();
    let sticky = filterPanel.offset().top - 60 + filterTopHgt;
    let stickyL = filterPanel.offset().left;
    let fpHeight = filterPanel.height();
    let secTop = $('#trialList').offset().top - 60;
    let mobileState = sticky + fpHeight;
    let myst = 0;
    window.onscroll = function() {
        stickyFilter(); 
        if(isDesktop()){
            stickyIconFunction()
        }
        if(isMobile()){
            container.find(".therapeuticAreasContainer .deases-icon").removeClass("active");
            container.find(".therapeuticAreasContainer .deases-icon").removeAttr('style');
        }
    }
    if(isMobile()){
        sticky = sticky + fpHeight;
        stickyMUP = sticky - fpHeight;
    }
    $(window).on('resize', function(){ 
        filterPanel.removeClass('sticky');
        filterPanel.removeAttr('style');
        $('#trialList').removeAttr('style');
        filterTopHgt = filterPanel.find('.filter-top-content').height();
        sticky = filterPanel.offset().top - 60 + filterTopHgt;
        stickyL = filterPanel.offset().left;
        fpHeight = filterPanel.height();
        secTop = $('#trialList').offset().top - 60;
        mobileState = sticky + fpHeight;
        if(isMobile()){
            container.find(".therapeuticAreasContainer .deases-icon").removeClass("active");
            container.find(".therapeuticAreasContainer .deases-icon").removeAttr('style');
            sticky = sticky + fpHeight;
            stickyMUP = sticky - fpHeight;
        }
        stickyFilter(); 
        if(isDesktop()){
            stickyIconFunction()
        }
    })

    $('.rc-title').on('click', function () {
        if($(this).hasClass('active')){
            $('.recruiting-icon-type').slideUp();
            $(this).removeClass('active');
            $(this).parents('.icons-representation').removeClass('active');
        }else{
            $('.recruiting-icon-type').slideDown(function(){
                sticky = filterPanel.offset().top - 60 + filterTopHgt;
            });
            $(this).addClass('active');
            $(this).parents('.icons-representation').addClass('active');
        }
    });
    
    function stickyFilter() {
        if (window.pageYOffset >= sticky) {
            filterPanel.addClass('sticky');
            $('#trialList').css({paddingTop: fpHeight});
            filterPanel.css({marginTop: -(filterTopHgt)});
            if(isIpad()){
                filterPanel.css({left: stickyL});
            }
            if(isMobile()){
                // filterPanel.css({marginTop: -(filterTopHgt+15)});
                $('.trials-section .filterPillsSelected').show();
                if(window.pageYOffset > scrollPos){
                    sticky = mobileState;
                    scrollPos = window.pageYOffset;
                    // $('.trials-section .filterPillsSelected').hide();
                    filterPanel.hide();
                }
                if(window.pageYOffset < scrollPos){
                    sticky = secTop;
                    scrollPos = window.pageYOffset;
                    // $('.trials-section .filterPillsSelected').show();
                    filterPanel.show();
                }
                // clearTimeout( $.data( this, "scrollCheck" ) );
                // $.data( this, "scrollCheck", setTimeout(function() {
                //     $('.trials-section .filterPillsSelected').show();
                // }, 250) );
            }
        } else {
            filterPanel.show();
            filterPanel.removeClass('sticky');
            filterPanel.removeAttr('style');
            $('#trialList').removeAttr('style');
        }
        if(isMobile){
            if(window.pageYOffset <= stickyMUP){
                filterPanel.show();
                filterPanel.removeClass('sticky');
                filterPanel.removeAttr('style');
                $('#trialList').removeAttr('style');
            }
        }
    }
    // let stickyIconL = container.find('.therapeuticAreasItem').offset().left+22.5;
    function stickyIconFunction() {
        let filterTopHgt = filterPanel.find('.filter-top-content').height();
        let filterPanelHeight = container.find('.trial-filter-panel').height()+ $('header').height() - filterTopHgt + 10;
        container.find('.therapeuticAreasContainer > div').each(function () {
            $this = $(this);
            $elmTop = $this.offset().top
            $elmChild = $this.children(".deases-icon");
            if ($(window).scrollTop() >= container.find('.therapeuticAreasContainer > div').first().offset().top-filterPanelHeight) {
                if ($(window).scrollTop() >= $elmTop-filterPanelHeight && $(window).scrollTop() < ($elmTop-filterPanelHeight + ($this.innerHeight() - ($elmChild.height() + 40)))) {
                    container.find(".therapeuticAreasContainer .deases-icon").removeClass("active");
                    $elmChild.addClass("active").css("cssText", "top:"+filterPanelHeight+"px");
                } else {
                    
                    if(($(window).scrollTop() +  filterPanelHeight) > $elmChild.next().offset().top) {
                        $elmChild.removeClass("active").css("cssText", "top:initial; bottom: 40px;");
                    } else if(($(window).scrollTop() + filterPanelHeight) <= $elmChild.next().offset().top) {
                        $elmChild.removeClass("active").css("cssText", "top:0px;");
                    }


                    // if($(window).scrollTop() > $elmChild.next().offset().top && ($(window).scrollTop() + filterPanelHeight) < ($elmChild.next().offset().top + $elmChild.next().outerHeight())) {
                    //     $elmChild.removeClass("active").css("cssText", "top:initial; bottom: 40px;");
                    // } else {
                    //     $elmChild.removeClass("active").css("cssText", "top:0px;");
                    // }

                    // $elmChild.removeClass("active").css("cssText", "top:0px;");
                    // if ($elmChild.hasClass('active')) {
                    //     let posT = $(window).scrollTop() - $elmTop+filterPanelHeight
                    //     $elmChild.removeClass("active").css("cssText", "top:" + posT + "px;");
                    // }    
                }
            } else {
                $elmChild.removeClass("active").css("cssText", "top:0px;");
            }
        });
    }
    $('.col-md-1.deases-icon').removeClass('hidden');
};

module.exports = BMSTrials;
