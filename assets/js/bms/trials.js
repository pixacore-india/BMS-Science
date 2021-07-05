let Filter = require("./filter");
let ViewAll = require("./view-all");

let Trials = function(obj) {
    let {container} = obj;
    let output = container.find('.output');
    let selectInputArray= [];
    let views = {
        trialFilters: new Filter({
            container: container.find(".trialContainer"),
            filter: ".card"
        }),

        viewAll: [],

        refreshFilters: function() {
            this.phaseFilter.refresh();
            this.trialFilters.refresh();
        }
    };
    container.find(".cardContainer .card").each(function() {
        let ta = $(this).attr("data-ta");
        // console.log(ta)
        views["viewAll"][ta] = new ViewAll({
            container:$(this),
            onViewAll: function() {
                views.refreshFilters();
            }
        });
    });
    container.find("input[type='checkbox']").change(function() {
        if(isMobile()) {
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
        selectedInputs = selectedInputs.concat(views.trialFilters.getSelectedInputs());

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
        container.find(`input[value="${removeItemArray}"]`).prop("checked", false);
        resetFilter();
        createFilterBtn();
    });
    $(document).on("click", ".removeFilter", function() {
        $(this).remove();
        let removeItemArray = $(this).attr("value");
        container.find(`input[value="${removeItemArray}"]`).prop("checked", false);
        resetFilter();
        createFilterBtn();
    });

    $( window ).resize(function() {
        if(isMobile()) {
            return;
        }

        resetFilter();
    });

    function resetFilter(){
        setFilters("trialFilters");
        // setFilters("therapeuticAreaFilter");
        // setFilters("phaseFilter");

        refreshViews();
    }

    function setFilters(filter){
        // console.log(filter)
        let selectedInputs = [];
        let trialInputs = [];
        let phaseInputs = [];
        container.find(`.${filter} .trls input[type='checkbox']:checked`).each(function() {
            selectedInputs.push( $(this).val() );
            trialInputs.push( $(this).val() );
            // console.log(selectedInputs, 'trls');
        });
        container.find(`.${filter} .phs input[type='checkbox']:checked`).each(function() {
            selectedInputs.push( $(this).val() );
            phaseInputs.push( $(this).val() );
            // console.log(selectedInputs, 'phs');
        });
        selectInputArray = selectedInputs;
        if(trialInputs.length >=1 && phaseInputs.length >= 1){
            selectedInputs = [];
            for(let t = 0; t < trialInputs.length; t++){
                for(let p = 0; p < phaseInputs.length; p++){
                    selectedInputs.push(trialInputs[t]+phaseInputs[p])
                }
            }
        }
        let filterValue = selectedInputs.length ? selectedInputs.join(', ') : '*';
        
        // console.log(filterValue)
        views[filter].update(filterValue);
    }

    function createFilterBtn(){
        output.html("");
        let selectedInputs = [];
        selectedInputs = selectInputArray;
        // console.log(selectedInputs)
        if(selectedInputs.length > 0){
            $('.resetfilter').removeClass('hidden');
        }else{
            $('.resetfilter').addClass('hidden');
        }
        for (let i = 0; i < selectedInputs.length; i++) {
            let value = selectedInputs[i];
            let textValue = container.find(`input[value='${value}']`).parent().find(".textValue").text();
           
            let buttons = $(`<a value="${value}" class="removeFilter ${value} ">${textValue}</a>`);
            buttons.appendTo(output);
        }
    }

    function refreshViews() {
        // let selectedPhases = views.phaseFilter.getSelectedInputs();
        let selectedTA = views.trialFilters.getSelectedInputs();
        let cardViews = views.viewAll;
        if(selectedTA.length) {
            cardViews = [];
            selectedTA.map(function(ta) {
                cardViews[ta.slice(1)] = views.viewAll[ta.slice(1)];
            });
        }
        // console.log(this.trialFilters)
        // console.log(this.trialFilters.iso.filteredItems.length)
        // console.log(this.trialFilters.iso.filteredItems.length)
        
        let isEmpty = false;
        let firstTAAvailable = '';
        for(let ta in cardViews) {
            if(!firstTAAvailable) {
                firstTAAvailable = ta;
            }
            // console.log(firstTAAvailable);
            // if(!cardViews[ta].update(selectedPhases)) {
            //     isEmpty = false;
            // }
        }
        if(isEmpty) {
            views.viewAll[firstTAAvailable].showEmptyMessage();
        }
    }

    function isDesktop() {
        return $(window).width() >= 768;
    }

    function isMobile() {
        return $(window).width() < 768;
    }

}

module.exports = Trials;