let User = require('./user');
let LocationFilter = require("./filters/location");

function PatentTypeSearch() {
    let $ = jQuery;
    let container;

    let init = function () {
        container = $(".searchPatientType");

        const views = {
            location: new LocationFilter({
                element: container.find(".formItem.locationItem"),
                callee: "patient-search"
            })
        };

        //checks user history
        container.find('[type=checkbox]:checked').parent().addClass('active');

        let filterValue = '';
        // validation
        container.find("form").validate({
            onfocusout: false,
            onkeyup: false,
            onclick: false,
            submitHandler: function (form) {
                // form.submit();
                const formJquery = $(form);
                // alert($('form').find('[name=meta_conditions]').val());
                if (formJquery.find('[type=checkbox]').is(':checked') || $('form').find('[name=meta_conditions]').val()) {
                    formJquery.find('.stepsContainer input').each((idx, el) => {
                        //console.log(el.type);
                        if (el.type === 'checkbox' && el.checked) {
                            filterValue = filterValue + el.value + ',';
                        }

                        if (el.type === 'hidden' && filterValue) {
                            el.value = filterValue.substring(0, filterValue.length - 1);
                            filterValue = '';
                        }

                        if (!el.value) {
                            el.removeAttribute('name')
                        }

                    });

                    formJquery.find('.stepsContainer select').each((idx, el) => {
                        //console.log(el.className);

                        if (!el.value) {
                            el.removeAttribute('name')
                        }


                    });

                    const location = container.find("#location-country").get(0);
                    const locationGeo = document.getElementsByName('dis_location')[0];
                    const bmsCurrentLocation = container.find('.formItem #bms_current_location').get(0);
                    if(location.value == "current-locations") {
                        location.value = "";
                        if(locationGeo.value) {
                            $(bmsCurrentLocation).removeAttr("disabled");
                        }
                    }

                    form.submit();
                }
            }
        });
    };

    init();
}

module.exports = PatentTypeSearch;
