let Filter = require("./filter");
let ViewAll = require("./view-all");
const UTILITY = require("./utility");
const { URL, URLSearchParams } = require('@lvchengbin/url');

let Specialty = function(obj) {
    let {container} = obj;
    // console.log(container);
    let output = container.find('.output');

    console.log(container);
    let views = {
        phaseFilter: new Filter({
            container: container.find(".phaseContainer"),
            filter: ".phaseItem"
        }),

        therapeuticAreaFilter: new Filter({
            container: container.find(".cardContainer"),
            filter: ".card"
        }),

        diseaseFilter: new Filter({
            container: container.find(".diseaseContainer"),
            filter: ".diseaseItem"
        }),

        viewAll: [],

        refreshFilters: function() {
            this.phaseFilter.refresh();
            this.diseaseFilter.refresh();
            this.therapeuticAreaFilter.refresh();
        }
    };

    if(!UTILITY.getQueryString(location.href,'tab')) {
        resetFilter();
    }

    container.find(".cardContainer .card").each(function() {
        let ta = $(this).attr("data-ta");
        views["viewAll"][ta] = new ViewAll({
            container:$(this),
            onViewAll: function() {
                views.refreshFilters();
            }
        });
    });
    
    const href = new URL(window.location.href);
    const search = location.search;
    const urlParams = new URLSearchParams(search);
    let count = urlParams.dict.length;
    urlParams.dict.forEach(function(value,index) {
        if(value[1] != '') {
            params = value[1].split(',');
            if(href.searchParams.get('tab') != '') {
                $('.tab-pane').removeClass('active in');
                $('.tab-thumb li').removeClass('active');
                $(`a[href="#${href.searchParams.get('tab')}"]`).parent().addClass('active');
                $('.tab-pane').each(function() {
                    if($(this).attr('id') == href.searchParams.get('tab')) {
                        $(this).addClass('active in');
                    }
                })

                $(`#${href.searchParams.get('tab')}`).find("input[type='checkbox']").each(function() {
                    let $this = $(this);
                    params.forEach(function(value,index) {
                        if(value == $this.val()) {
                            $this.prop({checked: true});
                        }
                    })
                })
            } 
        }
        
        if (!--count) {
            resetFilter();
            createFilterBtn();
        }
    })

    container.find("input[type='checkbox']").change(function() {
        if(isMobile() && !$(this).hasClass('diseaseOnly')) {
            return false;
        }

        resetFilter();
        createFilterBtn();
    });

    container.find(".cancelFilter").click(function() {
        if(isDesktop()) {
            return false;
        }

        let selectedInputs = [];
        selectedInputs = selectedInputs.concat(views.phaseFilter.getSelectedInputs()).concat(views.therapeuticAreaFilter.getSelectedInputs());

        if(selectedInputs.length) {
            for( let i=0; i<selectedInputs.length; i++ ) {
                let value = selectedInputs[i];
                container.find(`input[type='checkbox'][value='${value}']`).addClass("selected-inputs");
            }
        }

        container.find("input[type='checkbox']").not(".selected-inputs").prop("checked", false);
        setTimeout(function() {
            $(".selected-inputs").prop("checked", true).removeClass("selected-inputs");
        }, 2);
    });

    container.find(".applyFilter").click(function() {
        if(isDesktop()) {
            return false;
        }
        resetFilter();
        createFilterBtn();
    });

    container.find('.resetfilter').on( 'click', function() {
        output.html( "" );
        container.find('.filterPills input:checkbox').prop("checked", false);
        resetFilter();
        createFilterBtn();
    });

    container.find('.clearAllLink').on( 'click', function() {
        $(this).parent().find("input:checkbox").prop("checked", false);
        resetFilter();
        createFilterBtn();
    });

    $(document).on("click", ".removeFilter", function() {
        $(this).remove();
        let removeItemArray = $(this).attr("value");
       
        if(container.hasClass('active')) {
            container.find(`input[value="${removeItemArray}"]`).prop("checked", false);
            resetFilter();
        }
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        resetFilter();
    });

    // $( window ).resize(function() {
    //     if(isMobile()) {
    //         return;
    //     }

    //     resetFilter();
    // });

    function resetFilter(){
        setFilters("diseaseFilter");
        setFilters("phaseFilter");
        setFilters("therapeuticAreaFilter");
        refreshViews();
    }

    function setFilters(filter){
        let selectedInputs = [];
        container.find(`.${filter} input[type='checkbox']:checked`).each(function() {
            selectedInputs.push( $(this).val() );
        });
        
        if(container.hasClass('active')) {
            UTILITY.updateQueryString(location.href, filter, selectedInputs.join(","));
            UTILITY.updateQueryString(location.href, 'tab', container.attr('id'));
        }

        if(UTILITY.getQueryString(location.href, 'diseaseFilter') != '') {
            container.find('#diseaseOnly').removeClass('disease-toggle-on').addClass('disease-toggle-off');
            container.find('#diseaseOnly + label').removeClass('disease-toggle-on').addClass('disease-toggle-off');
        } else {
            container.find('#diseaseOnly').removeClass('disease-toggle-off').addClass('disease-toggle-on');
            container.find('#diseaseOnly + label').removeClass('disease-toggle-off').addClass('disease-toggle-on');

        }

        let filterValue = selectedInputs.length ? selectedInputs.join(', ') : '*';
        views[filter].update(filterValue);
    }

    function createFilterBtn(){
        output.html("");
        let selectedInputs = [];
        selectedInputs = selectedInputs.concat(views.phaseFilter.getSelectedInputs()).concat(views.therapeuticAreaFilter.getSelectedInputs());
        for (let i = 0; i < selectedInputs.length; i++) {
            let value = selectedInputs[i].replace(`.${container.find('#diseaseOnly').val()}`,'');
            let textValue = container.find(`input[value='${value}']`).parent().find(".textValue").text();
           
            if(value != '') {
                let buttons = $(`<a value="${value}" class="removeFilter ${value} ">${textValue}</a>`);
                buttons.appendTo(output);
            }
        }
    }

    function refreshViews() {
        let selectedPhases = views.phaseFilter.getSelectedInputs();
        let selectedDisease = views.diseaseFilter.getSelectedInputs();
        let selectedTA = views.therapeuticAreaFilter.getSelectedInputs();
        let cardViews = views.viewAll;
        if(selectedTA.length) {
            cardViews = [];
            selectedTA.map(function(ta) {
                cardViews[ta.slice(1)] = views.viewAll[ta.slice(1)];
            });
        }

        if(selectedDisease.length) {
            let modifySelectedInputs = selectedPhases;
            if(modifySelectedInputs.length) {
                selectedPhases = modifySelectedInputs.map(function(value,index) {
                    return value = value + selectedDisease[0];
                })
            } else {
                selectedPhases.push(selectedDisease[0]);
            }
        }

        let isEmpty = true;
        let firstTAAvailable = '';
        for(let ta in cardViews) {
            if(!firstTAAvailable) {
                firstTAAvailable = ta;
            }
            if(!cardViews[ta].update(selectedPhases)) {
                isEmpty = false;
            }
        }

        if(isEmpty && views.viewAll[firstTAAvailable] != undefined) {
            views.viewAll[firstTAAvailable].showEmptyMessage();
        }
    }

    function isDesktop() {
        return $(window).width() >= 768;
    }

    function isMobile() {
        return $(window).width() < 768;
    }
};

module.exports = Specialty;
