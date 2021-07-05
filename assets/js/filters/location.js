let API = require("./../api");
let UTILITY = require("./../utility");

let Location = function (obj) {
    if(UTILITY.isDiseaseArea() || UTILITY.isSpecialty() || UTILITY.conferenceView()){
        return false
    }
    const api = new API(),
        container = obj.element,
        country = container.find("#location-country"),
        state = container.find("#location-state"),
        city = container.find("#location-city"),
        radius = container.find("#location-radius"),
        geo = container.find("#location-geo"),
        searchCallback = obj.searchCallback,
        hasDisplay = obj.hasDisplay ? obj.hasDisplay : true,
        url = new URL(window.location.href),
        displayView = obj.displayView || "";


    let initialising = false;

    let location = {
        "filter_location": url.searchParams.get("filter_location") || country.val(),
        "filter_state": url.searchParams.get("filter_state") || state.val(),
        "bms_city": url.searchParams.get("bms_city") || city.val(),
        "dis_radius": url.searchParams.get("dis_radius") || "",
        "dis_location": url.searchParams.get("dis_location") || geo.val()
    };

    container.click(function (e) {
        if(!isHeaderView()) {
            e.stopPropagation();
            return false;
        }
    });

    container.find("select").on("change", function (event) {
        event.stopPropagation();
        resetChildren($(this));
        updateParam($(this));

        let value = $(this).val();
        if (value == "current-locations") {
            if (isSearchView()) {
                UTILITY.updateQueryString(window.location.href, "bms_current_location", "1");
            }
            fetchCurrentLocation(event);

            return false;
        }

        showChildren($(this));
        updateDisplay();

        if (searchCallback) {
            searchCallback(isHomeView() ? event : false);
        }
    });

    this.init = function () {
        if (isSearchView()) {
            //@TODO: move this to search.js based on the view.
            if (location["filter_location"] || location["dis_location"]) {
                $('.resultContainer .resultItems').first().addClass('open');
                $('.resultContainer .resultItems.open .resultItemsExpand').css('display', 'block');
                $('.accordianLi .showHideArrow').first().addClass('active');
            }
        }

        initialising = true;
        if (!isSearchView()) {
            fetchCurrentLocation({});
        } else {
            if (url.searchParams.get("bms_current_location") == "1") {
                fetchCurrentLocation({ noCallback: true });
                return;

            }

            updateCityList(location).then(function (res) {
                // enableChild(city);

                for (let name in location) {
                    if (location[name]) {
                        container.find(`[name="${name}"]`).val(location[name]);
                        showChildren(container.find(`[name="${name}"]`));
                    }
                }

                updateDisplay();
                $.uniform.update();

                initialising = false;
            });
        }
    };

    function updateDisplay() {
        if (isPatientSearchView() || isAdvancedSearchView()) {
            return;
        }
        let display = "";
        let displayCount = 0;
        if (hasDisplay) {
            if (isSearchView()) {
                for (let name in location) {
                    if (name == "dis_location" || !location[name]) {
                        continue;
                    }
                    displayCount++;
                    display += location[name] + ";";
                }

                display = display.substring(0, display.length - 1);
                container.parents(".widget").find(".filterLink").toggleClass("active filterSelected", display != "");            
                if (displayCount != 0) {
                    container.parents(".widget").find(".filterLink .filterCount").html("(" + displayCount + ")");
                } else {
                    container.parents(".widget").find(".filterLink .filterCount").html("");
                }

            }

            if (isHomeView()) {
                display = "location";
                for (let name in location) {
                    if (name == "dis_location" || name == "dis_radius" || !location[name]) {
                        continue;
                    }
                    display = location[name];
                }
            }

            if (display && display.indexOf("-") > -1) {
                display = display.replace(/-/g, " ");
            }
            $(displayView).html(display);
        }
    }

    function showChildren(ele) {
        let name = ele.attr("name");
        let value = ele.val();

        let children = container.find("[data-parent*='" + name + "']");
        if (!children.length || value == "") {
            return;
        }

        //add business rule as per our logic
        if (ele.is(country)) {
            if (value == "united-states") {
                children = children.not(city);
            } else {
                children = children.not(state);
            }
        }

        if (children.attr("data-api-source") == "1" && !initialising) {
            updateCityList(location).then(res => {
                if (location["bms_city"]) {
                    city.val(location["bms_city"]);
                    $.uniform.update(city);
                }

                enableChild(children);
            });
        } else {
            enableChild(children);
        }

        if (ele.is(city)) {
            let geoData = city.find(":selected").attr("geo_data");
            geo.val(geoData);
            if (isSearchView()) {
                location["dis_location"] = geoData;
                UTILITY.updateQueryString(window.location.href, "dis_location", geoData)
            }
        }
    }

    function updateParam(ele) {
        let name = ele.attr("name");
        let value = ele.val();

        if (isSearchView()) {
            if (value !== 'current-locations') {
                UTILITY.updateQueryString(window.location.href, name, value)
            }
        }

        location[name] = value;
    }

    function enableChild(ele) {
        ele.parents(".optionalField").show();

        ele.each(function () {
            if ($(this).hasClass("toggle-disabled")) {
                ele.removeAttr("disabled");

                // Show sort by distance filter
                $('#customOrder').children('option[value="geo_distance"]').show();
                $('#customOrder').children('option[value="geo_distance"]').removeAttr("disabled");
            }

            if (isSearchView()) {
                let name = $(this).attr("name");
                let value = location[name] || $(this).val();
                if (value) {
                    UTILITY.updateQueryString(window.location.href, name, value);
                    location[name] = value;
                }
            }
        });
    }

    function disableChild(ele) {
        let name = ele.attr("name");
        let value = ele.is("select") ? ele.find("option:first-child").val() : "";

        if (ele.hasClass("toggle-disabled")) {
            ele.attr("disabled", "disabled");

            // Hide sort by distance filter and apply sortby relevance
            $('#customOrder').children('option[value="geo_distance"]').hide();
            $('#customOrder').children('option[value="geo_distance"]').attr("disabled", "disabled");
            $('#customOrder').val('relevance');
            if (isSearchView()) {
                UTILITY.updateQueryString(window.location.href, 'orderby', 'relevance');
            }
        }

        ele.val(value);
        location[name] = "";
        ele.parents(".optionalField").hide();

        if (isSearchView()) {
            UTILITY.updateQueryString(window.location.href, name, "")
        }
    }

    /* Update City dropdown
    ** @param1 - country as String for Name of Country
    ** @param2 - state as String for Name of State
    ** @return - Nothing OR Void
    */
    function updateCityList(location) {
        if (!location["filter_location"]) {
            return new Promise(function (resolve, reject) {
                resolve(false);
            });
        }

        let requestData = {
            'location_type': 'city',
            'country': location["filter_location"].toLowerCase().trim().replace(/-/g, " ")
        };

        if (location["filter_state"] != '') {
            requestData['state'] = location["filter_state"].toLowerCase().trim().replace(/-/g, " ");
        }

        return api.get('/wp-json/boldsci/v1/search/location/', requestData).then((data, errorHandler) => {
            city.find("option").remove();
            let options = '<option value="">City</option>';
            for (let i = 0; i < data.location_results.length; i++) {
                let geo = `${data.location_results[i].longitude},${data.location_results[i].latitude}`,
                    value = data.location_results[i].city.trim().replace(/ /g, "-"),
                    city = data.location_results[i].city;

                options += `<option geo_data="${geo}" value="${value}">${city}</option>`;
            }

            city.html(options);
            return true;
        });
    }

    function fetchCurrentLocation(event) {
        let geo_location;
        if (!initialising) {
            country.val("current-locations");
        }
        $.uniform.update(country);

        api.get_geo(initialising).then(res => {
            geo_location = res;
            console.log('geo_location', geo_location)
            initialising = false;
            if (!geo_location) {
                return;
            }
            enableChild(radius);

            if(country.length) {
                country.val("current-locations");
            }
            $.uniform.update(country);

            location["filter_location"] = "current location";

            geo.val(`${geo_location.lon},${geo_location.lat}`);

            if (isSearchView()) {
                location["filter_location"] = "current location";
                location["bms_city"] = "";
                UTILITY.updateQueryString(window.location.href, "filter_location", "");
                UTILITY.updateQueryString(window.location.href, "bms_city", "");

                UTILITY.updateQueryString(window.location.href, "dis_location", geo.val());
                //UTILITY.updateQueryString(window.location.href, "dis_radius", radius.val());
                radius.val(UTILITY.getQueryString(window.location.href, "dis_radius"));
                $.uniform.update(radius);
            }

            updateDisplay();

            if (searchCallback && !event.noCallback) {
                searchCallback(isHomeView() ? event : false);
            }
            // return api.get('/wp-json/boldsci/v1/search/location/', {
            //     'location_type': 'address',
            //     'lat': geo_location.lat ,
            //     'lon': geo_location.lon,
            //     '_wpnonce': phpData.rest_nonce,
            // });
        }).catch( error => {
            console.log(error);
            initialising = false;
        });
        // .then( res => {
        //     let loc = res.location_results.pop();
        //     location["filter_location"] = "current location";

        //     geo.val(`${geo_location.lon},${geo_location.lat}`);

        //     if(isSearchView()) {
        //         location["filter_location"] = "current location";
        //         location["bms_city"] = "";
        //         UTILITY.updateQueryString(window.location.href, "filter_location", "");
        //         UTILITY.updateQueryString(window.location.href, "bms_city", "");

        //         UTILITY.updateQueryString(window.location.href, "dis_location", geo.val());
        //         UTILITY.updateQueryString(window.location.href, "dis_radius", radius.val());
        //     }

        //     updateDisplay();

        //     if(searchCallback && !event.noCallback) {
        //         searchCallback(isHomeView() ? event : false);
        //     }
        // });
    }

    function resetChildren(currentEle) {
        if (isSearchView() && country.val() !== "current-locations") {
            UTILITY.updateQueryString(window.location.href, "bms_current_location", "");
        }
        let parents = [currentEle.attr("name")];
        let fieldsHidden = {};

        while (parents.length) {
            let name = parents.pop();
            let children = container.find("[data-parent*='" + name + "']");
            if (children.length) {
                children.each(function () {
                    let id = $(this).attr("id");
                    let defaultValue = $(this).find("option").attr("value");
                    if (fieldsHidden[id]) {
                        return;
                    }

                    parents.push($(this).attr("name"));
                    fieldsHidden[id] = true;
                    disableChild($(this));
                });
            }
        }

        $.uniform.update();
    }

    function isSearchView() {
        return obj.callee == "search";
    }

    function isHomeView() {
        return obj.callee == "home";
    }

    function isAdvancedSearchView() {
        return obj.callee == "advanced-search";
    }

    function isPatientSearchView() {
        return obj.callee == "patient-search";
    }

    function isHeaderView() {
        return obj.callee == "header";
    }

    this.init();
};

module.exports = Location;
