let BSChart = require("./bs-chart");
let API = require("./api");
let LocationFilter = require("./filters/location");

require('easyAutoComplete');

function home() {

    const api = new API();
    const searchFormHome = document.getElementById('js-search-home');
    const searchTerm = document.getElementsByName('s')[0];
    const location = document.getElementsByName('filter_location')[0];
    const locationState = document.getElementsByName('filter_state')[0];
    const bmsCurrentLocation = document.getElementsByName('bms_current_location')[0];
    const locationDisRadius = document.getElementsByName('dis_radius')[0];
    const locationGeo = document.getElementsByName('dis_location')[0];
    const container = $(".homeChartSection");
    const searchButton = document.getElementById('js-sendSearch');
    const countNumber = document.getElementById('js-countNumber');
    const chartText = document.getElementById('js-chartText');
    const taFilter = $("[name='tarea[]']");

    window.addEventListener( "pageshow", function ( event ) {
        var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
        if ( historyTraversal ) {
          // Handle page restore.
          window.location.reload();
        }
      });

    if (searchButton) {
        searchButton.addEventListener('click', function () {
            $(searchFormHome).submit();
        }, false);
    }
    if (countNumber) {
        countNumber.addEventListener('click', function () {
            // if($(this).text()=='0'){
            //     return
            // }
            if(!$(this).parent().hasClass('empty-info')) {
                $(searchFormHome).submit();
            }
        }, false);
    }
    if(chartText){
        chartText.addEventListener('click', function () {
            if(!$(this).parent().hasClass('empty-info')) {
                $(searchFormHome).submit();
            }
        }, false);
    }
    $(searchFormHome).on('submit', function () {
        if(location.value == "current-locations") {
            location.value = "";
            if(locationGeo.value) {
                $(bmsCurrentLocation).removeAttr("disabled");
            }
        }
    });

    const sendSearchButtonD = document.getElementById('js-sendSearch-bottom-desktop');
    if (sendSearchButtonD) {
        sendSearchButtonD.addEventListener('click', function () {
            // if($(this).hasClass('empty-trial')){
            //     return
            // }
            const celgene_trial = document.getElementById('filter_celgene_trial');
            // alert(celgene_trial.value)
            if (celgene_trial) {
                celgene_trial.value = "celgene-trial,celgene-compound";
            }
            $(searchFormHome).submit();
        }, false);
    }
    const sendSearchButtonM = document.getElementById('js-sendSearch-bottom-mobile');
    if (sendSearchButtonM) {
        sendSearchButtonM.addEventListener('click', function () {
            const celgene_trial = document.getElementById('filter_celgene_trial');
            // alert(celgene_trial.value)
            if (celgene_trial) {
                celgene_trial.value = "celgene-trial,celgene-compound";
            }
            $(searchFormHome).submit();
        }, false);
    }

    const homeChart = $(".homeChartSection");
    homeChart.find(".tourPopup .closeTourPopup").click(function (e) {
        $(this).parents('.tourPopup').hide();
    });

    // Add first set of data on page load.
    window.addEventListener('DOMContentLoaded', handleOnLoad, false);

    function updateFormFilters(data) {
        $('#filter_phase').val(data.phases);
        $('#filter_status').val(data.statuses);
    }

    const views = {
        chart: new BSChart({
            getViews: function () {
                return views;
            }
        }),

        form: $("#js-search-home"),

        location: new LocationFilter({
            element: $(".filterSubOption.term-location"),
            callee: "home",
            displayView: ".locationDropItems .dropDownLoc",
            searchCallback: function(data) {
                handleSearch(data);
            }
        }),

        bindEvents: function () {
            this.form.on("updateFilters", function (e, data) {
                updateFormFilters(data)
            });
        }
    };

    searchTerm.onchange = (e) => {
        if (!$("body").hasClass("tax-specialty") && !$('body').hasClass('home') && !$('body').hasClass('single-therapeutic-area')) {
            handleSearch(e); //Home page handle for search and donut
        }
    };


    taFilter.change( e => {
        handleSearch(e);
    });

    // Tooltip Code
    function getCookieHome(name) {
        var dc = document.cookie;
        var prefix = name + "=";
        var begin = dc.indexOf("; " + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
            var end = document.cookie.indexOf(";", begin);
            if (end == -1) {
                end = dc.length;
            }
        }
        // because unescape has been deprecated, replaced with decodeURI
        //return unescape(dc.substring(begin + prefix.length, end));
        return decodeURI(dc.substring(begin + prefix.length, end));
    }

    const chartInfo = $(`${$('body').attr('class').split('')[0]} .chartInfo`).clone();

    $('.pieChartSection').on('click', '.resetFiltersLink', function (e) {
        const checkboxes = $('.mobileLegends').find('.js-label-filter:checked');
        const addedFilters = $('#canvas-holder .addedFilter');
        for (let i = 0; i < addedFilters.length; i++) {
            //addedFilters[i].click();
             checkboxes.prop('checked', false);
             addedFilters.removeClass('addedFilter');
             addedFilters.addClass('ga-select-filter');
        }
        handleSearch(e);
        $('.chartInfo').html(chartInfo.html());
        $(this).hide();
        $('[data-accordion="theraupeticArea"]').text('THERAPEUTIC AREA');
    });




    eraseCookieHome = (name) => {
        document.cookie = name + '=; Max-Age=-99999999;';
    };

    container.find(".tourPopup.smallSize .closeTourPopup").click(function (e) {
        $(this).parents('.tourPopup.smallSize').hide();
        eraseCookieHome(`isHomePopupViewed_${phpData.userId}`);
        document.cookie = `isHomePopupViewed_${phpData.userId}=true`;
    });

    let popupHome = getCookieHome(`isHomePopupViewed_${phpData.userId}`);

    if (popupHome == "true") {
        $(".tourPopup.smallSize").hide();
    } else {
        if (popupHome == 'null') {
            document.cookie = `isHomePopupViewed_${phpData.userId}=false`;
        }
        $(".tourPopup.smallSize").show();
    }
    // End Tooltip Code


    /**
     * Don't submit the form from search icon. Update chart instead.
     */
    function handleSearch(e) {
        if(e.preventDefault) {
            e.preventDefault();
        }

        // console.log(da);

        let request = {
            's': searchTerm.value,
            'dis_location': locationGeo ? locationGeo.value : "",
            'dis_radius': locationDisRadius ? locationDisRadius.value : "",
            'state': locationState ? locationState.value : '',
            'location': location && location.value != "current-locations" ? location.value : ""
        };

        if(taFilter.length) {
            let da = [];
            let searchDa = [];
            taFilter.filter(":checked").each(function() {
                da.push(`bms-pipeline-${$(this).val()}`);
                searchDa.push("."+$(this).val());
            });
            $('#filter_specialty').val(searchDa);

            request['da'] = da;
        }
        
        views.chart.setUpdateLegends(true);
        views.chart.update(request);

        // For some reason we need to blur out of current focus element.
        // This way we don't have to click twice checkboxes.
        // currentFocus.blur();
        return false;
    }

    /**
     * Handle AJAX response to Elastic Search on page load.
     */
    function handleOnLoad(e) {
        if ('' !== phpData.payload) {
            // set initial checkboxes
            // Get status filters.
            // console.log("Donut data onLoad", phpData.payload);
            views.chart.init(phpData.payload);

            return;
        }

        api.get(phpData.searchApiUrl, {}).then(function (data) {
            views.chart.init(data)
        }, views.chart.errorHandler);
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function (e) {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    views.bindEvents();
}

module.exports = home;
