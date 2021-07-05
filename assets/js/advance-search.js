let LocationFilter = require("./filters/location");
let UTILITY = require("./utility");

let advancedSearch = function () {
    let $ = jQuery;

    const container = $(".advanceSearchCont");
    const oldValue = [];
    const addOtherField = container.find('.addOtherField');
    let selectedTypes = [];
    let customCount = container.find('.customSelect').length;
    let dateValue = '';
    let startDate = '';
    let endDate = '';
    let locationFilter;

    container.find('.customSelect').val('');
    container.find('.selector span').text('All Fields');
    container.find('.type-customSelect input').val('');
    container.on("change", ".customSelect", function(e) {
        addCustomSelectListener(e);
    });
    container.on("click", ".addField", function(e) {
        addField(e);
    });
    container.on("click", ".removeField", function(e) {
        if (!addOtherField.html()) {
            addOtherField.html(`<a href="#" class="addField">Add another field</a>`);
        }

        removeField(e);
    });

    const allFieldOptions = initAutoComplete("/wp-json/boldsci/v1/search/search_param/?s=");
    const searchConditionsOptions = initAutoComplete("/wp-json/boldsci/v1/search/search_param/?s=", "conditions");
    const searchInterventionsOptions = initAutoComplete("/wp-json/boldsci/v1/search/search_param/?s=", "interventions");

    const addField = (e) => {
        e.preventDefault();
        customCount = customCount + 1;
        const options = ['Condition', 'Other terms', 'Study types', 'Study results', 'Status recruitment',
            'Expanded access', 'Age', 'Age group', 'Sex', 'Accepts healthy volunteers', 'Intervention/Treatment', 'Title/Acronym',
            'Outcome measure', 'Sponsor/Collaborator', 'Sponsor (lead)', 'Study IDs', 'Location',
            'Location terms', 'Phase', 'Funder type', 'Study documents', 'Date - Study start',
            'Date - Primary completion', 'Date - First posted', 'Date - Last update posted'].sort();
        let createSelect = '<option>All Fields</option>';
        options.forEach(val => {
            const newOption = `<option>${val}</option>`;
            createSelect = createSelect + newOption;
        });

        container.find('.customSelectDiv').append(`<ul class="addField${customCount}">
                            <li class="col-md-6 col-xs-12">
                                <span class="andTxt">AND</span>
								<select class="customSelect customSelect${customCount}">
								   ${createSelect}
								</select>
							</li>
							<li class="col-md-6 col-xs-12 type-customSelect type-customSelect${customCount}">
								<input type="text" value="" placeholder="" class="textbox">
							</li>
							 <a class="closeBtn removeField removeField${customCount}">X</a>
							</ul>`);
        //uniform to update the style of newly created element
        container.find(`.customSelect${customCount}`).uniform();
        const newCustomSelect = container.find(`.customSelect${customCount}`)[0];

        //dynamically disable options when creating new
        if (selectedTypes.length) {
            for (let option = 1; option < newCustomSelect.length; option++) {
                let disableCount = 0;
                if (selectedTypes.includes(newCustomSelect[option].value)) {
                    disableCount++;
                    newCustomSelect[option].disabled = true;
                    if (disableCount === selectedTypes.length) {
                        break;
                    }
                }
            }
        }
        if (container.find('.customSelect').length === newCustomSelect.length) {
            addOtherField.html('');
        }
    };

    const removeField = (e) => {
        const elementTarget = e.target;
        selectedTypes = selectedTypes.filter((filterData) => filterData !== $(e.target.parentElement).find('li:first-child .selector span').text());
        modifyOptions();
        $(elementTarget).off();
        $(elementTarget).parent().off();
        $(elementTarget).parent().remove();

        if(locationFilter) {
            locationFilter = null;
        }
    };

    // function to listen custom selector and dynamically create fields accordingly
    const addCustomSelectListener = (e) => {
        e.preventDefault();
        const target = e.target;
        const targetValue = target.value;
        const className = target.classList.item(1);

        selectedTypes = selectedTypes.filter(selectedType => selectedType !== oldValue[className]);
        selectedTypes.push(targetValue);
        //enables disable options
        modifyOptions();
        changeValueSwitch(target);
    };

    const changeValueSwitch = (target) => {
        const targetValue = target.value;
        const className = target.classList.item(1);
        const type = `.type-${className}`;
        container.find(type).css('display', 'block');
        oldValue[className] = targetValue;

        let optionName = '';
        container.find(type).addClass('dynamic');

        switch (targetValue) {
            case 'All Fields':
                optionName = 's';
                break;
            case 'Condition':
                optionName = 'meta_conditions';
                break;
            case 'Other terms':
                optionName = 'meta_other_terms';
                break;
            case 'Intervention/Treatment':
                optionName = 'meta_intervention';
                break;
            case 'Title/Acronym':
                optionName = 'meta_title';
                break;
            case 'Outcome measure':
                optionName = 'meta_design_outcomes';
                break;
            case 'Sponsor/Collaborator':
                optionName = 'meta_sponsor_colla';
                break;
            case 'Sponsor (lead)':
                optionName = 'meta_sponsor_lead';
                break;
            case 'Location terms':
                optionName = 'meta_location';
                break;
            case 'Date - Study start':
                optionName = 'date_start_date';
                break;
            case 'Date - Primary completion':
                optionName = 'date_completion_date';
                break;
            case 'Date - First posted':
                optionName = 'date_study_first_posted_date';
                break;
            case 'Date - Last update posted':
                optionName = 'date_last_updated';
                break;
            case 'Study IDs':
                optionName = 'meta_nct_id';
                break;

            default:
                optionName = 's';
                break;

        }
        switch (targetValue) {
            case 'Other terms':
            case 'Title/Acronym':
            case 'Outcome measure':
            case 'Sponsor/Collaborator':
            case 'Sponsor (lead)':
            case 'City':
            case 'Location terms':
                container.find(type).html(`<input type="text" class="textbox" name=${optionName}>
											<label name=${optionName}></label>`);
                $(`${type} .textbox`).uniform();
                break;
            case 'Condition':
                container.find(type).html(`<input type="text" class="textbox search-terms search-terms-conditions" list="condtion" name=${optionName} autocomplete="off">`);
                $(`${type} .textbox`).uniform();
                $(".search-terms-conditions").easyAutocomplete(searchConditionsOptions);
                break;
            case 'Intervention/Treatment':
                container.find(type).html(`<input type="text" class="textbox search-terms search-terms-interventions" list="intervention" name=${optionName} autocomplete="off">`);
                $(`${type} .textbox`).uniform();
                $(".search-terms-interventions").easyAutocomplete(searchInterventionsOptions);
                break;
            case 'Study IDs':
                container.find(type).html(`<input type="text" class="textbox" name=${optionName}>
											<label name=${optionName}></label>`);
                $(`${type} .textbox`).uniform();
                break;
            case 'Age':
                container.find(type).html(`<input type="number" min="0" class="textbox" name="meta_patient_age">
                                            <label for="meta_patient_age"></label>`);
                $(`.dynamic ${type} .textbox`).uniform();
                break;
            case 'All Fields':
                container.find(type).html(`<input type="text" class="textbox" name=${optionName} >
                                            <label name=${optionName}></label>`);
                $("#s").easyAutocomplete(allFieldOptions);
                // $(`.dynamic ${type} .textbox`).uniform();
                break;
            case 'Date - Study start':
            case 'Date - Primary completion':
            case 'Date - First posted':
            case 'Date - Last update posted':
                container.find(type).html(`<div class="row">
                    <input id=${optionName} class="dateInputs" type="hidden" name=${optionName} value="" />
                    <div class="col-xs-5 padrht0">
                        <input type="text" value=""  placeholder="MM/DD/YYYY" class="textbox startDatePicker" id="datetimepicker1">
                    </div>
                    <div class="col-xs-2">
                        <strong>to</strong>
                    </div>
                    <div class="col-xs-5 padlft0">
                        <input type="text" value=""  placeholder="MM/DD/YYYY" class="textbox endDatePicker" id="datetimepicker2">
                    </div>
                </div>`);
                container.find('#datetimepicker1, #datetimepicker2').datetimepicker({
                    debug: true,
                    format: 'MM-DD-YYYY',
                });

                container.find("#datetimepicker1").on("dp.change", (e) => {
                    container.find('#datetimepicker2').data("DateTimePicker").minDate(e.date);
                });


                container.find("#datetimepicker1").on("click", () => {
                    container.find('#datetimepicker2').data("DateTimePicker").hide();
                });

                container.find("#datetimepicker2").on("click", (e) => {
                    container.find('#datetimepicker1').data("DateTimePicker").hide();

                });

                container.find("#datetimepicker2").on("dp.change", (e) => {
                    container.find('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
                });


                container.find(".startDatePicker").on("dp.change", (e) => {

                    var mydate = formatDate(e.date);
                    startDate = mydate;
                    dateValue = startDate + "," + endDate;

                    $(e.target).parents("li").find(".dateInputs").val(dateValue);
                });

                container.find(".endDatePicker").on("dp.change", (e) => {

                    var mydate = formatDate(e.date);
                    endDate = mydate;
                    dateValue = startDate + "," + endDate;

                    $(e.target).parents("li").find(".dateInputs").val(dateValue);
                });


                break;
            case 'Study types':
                container.find(type).html(`
                               <span class="customSelectItem"> <label><input type="checkbox" value="all" name="stype" class="customCheck"> All studies</label>
								<label><input type="checkbox" name="stype" value="interventional" class="customCheck"> Interventional studies</label>
								<label><input type="checkbox" name="stype" value="observational"  class="customCheck"> Observational studies</label>
								<label class="ml"><input name="stype" value="observational-patient-registry" type="checkbox" class="customCheck"> Patient registries</label>
								<label><input type="checkbox" name="stype" value="expanded-access"  class="customCheck"> Expanded access studies</label>
								<input type="hidden" name="study_type" />
								<label class="ml"><input name="atype" type="checkbox" value="individual-patients" class="customCheck"> Individual patients</label>
								<label class="ml"><input name="atype" type="checkbox" value="intermediate-size-population" class="customCheck"> Intermediate-size population</label>
								<label class="ml"><input name="atype" type="checkbox"  value="treatment-protocol"  class="customCheck"> Treatment IND/protocol</label>
                                <input type="hidden" name="access_type" />
                                <label for="meta_study_type" class="error"></label></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Study results':
                container.find(type).html(`
                                <span class="customSelectItem"><label><input type="checkbox" name="has_result_groups" value="" class="customCheck"> All studies</label>
								<label><input type="checkbox" name="has_result_groups" value="yes" class="customCheck"> Studies with results</label>
								<label><input type="checkbox" name="has_result_groups" value="no"  class="customCheck"> Studies without results</label>                               
								<input type="hidden" name="filter_has_result_groups" />
								<label for="filter_has_result_groups" class="error"></label></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Status recruitment':
                container.find(type).html(`
                             <span class="customSelectItem">
                                <label><input type="checkbox" class="customCheck" value="not-yet-recruiting" name="status">Not yet recruiting</label>
								<label><input type="checkbox" class="customCheck" value="recruiting" name="status"> Recruiting</label>
								<label><input type="checkbox" class="customCheck" value="enrolling-by-invitation" name="status"> Enrolling by invitation</label>
								<label><input type="checkbox" class="customCheck" value="active-not-recruiting" name="status"> Active, not recruiting</label>
								<label><input type="checkbox" class="customCheck" value="other" name="status"> Other</label>
								                                <input type="hidden" name="filter_status" />
								<label class="ml"><input type="checkbox" class="customCheck" value="suspended" name="overall_status"> Suspended </label>
								<label class="ml"><input type="checkbox" class="customCheck" value="terminated" name="overall_status"> Terminated</label>
                                <label class="ml"><input type="checkbox" class="customCheck" value="completed" name="overall_status"> Completed</label>
                                <label class="ml"><input type="checkbox" class="customCheck" value="withdrawn" name="overall_status"> Withdrawn</label>
                                <label class="ml"><input type="checkbox" class="customCheck" value="unknown-status" name="overall_status"> Unknown status</label>
                                								<input type="hidden" name="meta_overall_status" />
                                <label for="filter_status" class="error"></label>
                                </span>`);

                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Expanded access':
                container.find(type).html(`
                <span class="customSelectItem"> <label><input type="checkbox" name="expanded_access" value="yes" class="customCheck">Available</label>
								<label><input type="checkbox" name="expanded_access" value="no" class="customCheck"> No longer available</label>
								<label><input type="checkbox" name="expanded_access" value="temporarily" class="customCheck"> Temporarily not available</label>
								<label><input type="checkbox" name="expanded_access" value="approved" class="customCheck"> Approved for marketing</label>
                                <input type="hidden" name="meta_expanded_access" />
                                <label for="meta_expanded_access" class="error"></label></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Age group':
                container.find(type).html(`
                <span class="customSelectItem"><label><input type="checkbox" name="age" value="birth-to-17-years" class="customCheck">Child (birth-17 years)</label>
								<label><input type="checkbox" name="age" value="18-to-64-years" class="customCheck"> Adult (18-64 years)</label>
								<label><input type="checkbox" name="age" value="64-years" class="customCheck"> Older adult (65+ years)</label>
                                <input type="hidden" name="filter_age" />
                                <label for="filter_age" class="error"></label></span>`);

                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Sex':
                container.find(type).html(`
                <span class="customSelectItem"><label><input type="checkbox" name="sex" value="all" class="customCheck">All</label>
								<label><input type="checkbox" name="sex" value="female" class="customCheck"> Studies with female participants</label>
								<label><input type="checkbox" name="sex" value="male" class="customCheck"> Studies with male participants</label>
                                <input type="hidden" name="filter_sex" />
                                <label for="filter_sex" class="error"></label></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Accepts healthy volunteers':
                container.find(type).html(`
                <span class="customSelectItem"><label><input type="checkbox" class="customCheck" value="accepts-healthy-volunteers" name="filter_healthy_volunteers">Healthy volunteers may participate in the study</label>
                                 <label for="healthy_volunteers" class="error"></label>
                                 <input type="hidden" name="filter_healthy_volunteers" />
                                 </span>
                                `);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Phase':
                container.find(type).html(`
                <span class="customSelectItem"><label><input type="checkbox" class="customCheck" value="early-phase-1" name="phase">Early phase 1</label>
                                <label><input type="checkbox" class="customCheck" value="phase-1" name="phase">Phase 1</label>
                                <label><input type="checkbox" class="customCheck" value="phase-2" name="phase">Phase 2</label>
                                <label><input type="checkbox" class="customCheck" value="phase-3" name="phase">Phase 3</label>
                                <label><input type="checkbox" class="customCheck" value="phase-4" name="phase">Phase 4</label>
                                <label><input type="checkbox" class="customCheck" value="n-a" name="phase">Not applicable</label>
                                <input type="hidden" name="filter_phase" /></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Funder type':
                container.find(type).html(`
                <span class="customSelectItem"><label><input type="checkbox" name="agency_class" value="nih" class="customCheck">NIH</label>
                                <label><input type="checkbox" name="agency_class" value="u-s-fed" class="customCheck">Other U.S. federal agency</label>
                                <label><input type="checkbox" name="agency_class" value="industry" class="customCheck">Industry</label>
                                <label><input type="checkbox" name="agency_class" value="other" class="customCheck">All others (individuals, universities, organizations)</label>
                                <input type="hidden" name="filter_agency_class" />
                                </span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Study documents':
                container.find(type).html(`
                <span class="customSelectItem">
                                <label><input type="checkbox" name="provided_documents" value="protocol" class="customCheck">Study protocols</label>
                                <label><input type="checkbox" name="provided_documents" value="sap" class="customCheck">Statistical analysis plans (SAPs)</label>
                                <label><input type="checkbox" name="provided_documents" value="icf" class="customCheck">Informed consent forms (ICFs)</label>
                                <input type="hidden" name="meta_provided_documents" /></span>`);
                $(`.dynamic .customCheck`).uniform();
                container.find(type).removeClass('dynamic');
                break;
            case 'Location':
                let html = "";
                //build country
                UTILITY.countryOptions.map(arr => {
                    return { val: arr.val, value: arr.value }
                });

                let countrySelect = '<option value="">Country</option>';
                UTILITY.countryOptions.forEach(option => {
                    const countryOption = `<option value=${option.val}>${option.value}</option>`;
                    countrySelect = countrySelect + countryOption;
                });
                html += `
                <div class="optionalField">
                <select id="location-country" name="filter_location" class="customSelect country">
                    ${countrySelect}
                </select>               
                <label for="filter_location" class="error"></label></div>`;


                //build state
                UTILITY.stateOptions.sort((first, second) => {
                    return sortArray(first, second);
                });
                let stateSelect = '<option value="">State</option>';
                UTILITY.stateOptions.forEach(option => {
                    const stateOption = `<option value=${option.val}>${option.value}</option>`;
                    stateSelect = stateSelect + stateOption;
                });
                html += `
                <div class="optionalField" style="display:none;">
                <select id="location-state" name="filter_state" class="customSelect state" data-parent="filter_location"> 
                ${stateSelect}
                </select>
                <label for="filter_state" class="error"></label></div>`;


                //build city
                html += `
                <div class="optionalField" style="display:none;">
                <select id="location-city" name="bms_city" class="customSelect city" data-parent="filter_location,filter_state" data-api-source="1">
                    <option value="" selected="selected">City</option>
                </select>
                <label for="filter_distance" class="error"></label></div>
                <input type="hidden" name="dis_location" id="location-geo" data-parent="bms_city">
                <input type="hidden" name="bms_current_location" value="1" disabled id="bms_current_location">`;



                //build radius
                html += `
                <div class="optionalField" style="display:none;">
                <select id="location-radius" name="dis_radius" class="customSelect distance toggle-disabled" disabled data-parent="bms_city">
                    <option value="50mi">50 miles</option>
                    <option value="100mi">100 miles</option>
                    <option value="200mi">200 miles</option>
                    <option value="300mi">300 miles</option>
                </select>
                <label for="filter_distance" class="error"></label></div>`;
                container.find(type).addClass("location-advanced").html(html);

                $(`.dynamic .customSelect`).uniform();
                container.find(type).removeClass('dynamic');

                locationFilter = new LocationFilter({
                    element: container.find(type),
                    callee: "advanced-search"
                });
                break;
            case 'All Fields':
                container.find(type).html(`<input type="text" class="textbox" name="input_text">
											<label for="input_text"></label>`);
                break;
            default:
                $("#s").easyAutocomplete(allFieldOptions);
        }
    };

    function initAutoComplete(requestUrl, type = "") {
        let searchType = "";
        if(type) {
            searchType = `&type=${type}&_wpnonce=${phpData.rest_nonce}`;
        }

        return {
            url: function (phrase) {
                return requestUrl + phrase + searchType;
            },
            list: {
                match: {
                    enabled: true
                },
                onClickEvent: function (e) {}
            },
            template: {
                type: "custom",
                method: function (value, item) {
                    return value
                }
            },
            minCharNumber: 3,
            listLocation: "search_results",
            getValue: "name"
        };
    }


    const sortArray = (first, second) => {
        if (first.value < second.value) //sort string ascending
        {
            return -1;
        } else if (first.value > second.value) {
            return 1;

        } else {
            return 0 //default return value (no sorting)
        }
    };

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    //enables disable options
    const modifyOptions = () => {
        container.find(`.customSelect`).each((idx, element) => {
            // modifyOptions(element, className);
            for (let option = 1; option < element.length; option++) {
                element[option].disabled = selectedTypes.includes(element[option].value);
            }
        });
    };
    let filterValue = '';
    // validation
    container.find("form").validate({
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        submitHandler: function (form) {
            $("[name='s']").val($("#s").val());
            const formJquery = container.find(form);
            formJquery.find('.type-customSelect input').each((idx, el) => {
                if (el.type === 'checkbox' && el.checked) {
                    filterValue = filterValue + el.value + ',';
                    el.value = '';
                }

                if (el.type === 'hidden' && filterValue) {
                    el.value = filterValue.substring(0, filterValue.length - 1);
                    filterValue = '';
                }

                if (!el.value) {
                    el.removeAttribute('name')
                }

                const location = container.find("#location-country").get(0);
                const locationGeo = document.getElementsByName('dis_location')[0];
                const bmsCurrentLocation = container.find('.advanceSearchForm #bms_current_location').get(0);
                if(location && location.value == "current-locations") {
                    location.value = "";
                    if(locationGeo.value) {
                        $(bmsCurrentLocation).removeAttr("disabled");
                    }
                }
            });
            form.submit();
        }
    });
};

module.exports = advancedSearch;
