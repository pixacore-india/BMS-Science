const UTILITY = require("./../utility");

let Filter = function(obj) {
    const {container, filter, type, inputContainer, relation} = obj;
    const self = this;
    let views = false;
    container.isotope({
        itemSelector: filter,
        filter: '*',
        resize: true,
        containerStyle: { position: 'relative' },
        layoutMode: 'fitRows',
    });
    let iso = container.data('isotope');
    
    /**
     * Refresh the isotope view on change
     */
    this.refresh = function() {
        container.isotope('layout');
    };

    /**
     * Updates the filters and then calls refresh
     * @param filterValue: New filter to be applied.
     */
    this.update = function(filterValue = "*") {
        if(filterValue == "*") {
            // resetSkipValue();
        }
        
        container.data('filterValue', filterValue);
        container.isotope({filter: filterValue});
        
       // let count = iso.filteredItems.length;
        // if(count == 0){
        //     $(".trialContainerP").hide();
        //     $(".cardNoResult").addClass('bms-trials-noResult-show');
        // }else{
        //     $(".trialContainerP").show();
        //     $(".cardNoResult").removeClass('bms-trials-noResult-show');
        // }
        setTimeout(function() {
            self.refresh();

        }, 100);
        setTimeout(function() { 
            let nctCount = [];
            container.find('.cardContainer:visible .card:visible .phaseRow.selectedItem').each(function (){
                let nctids = $(this).data('nctids').split(',');
                // console.log(nctids);
                for(let n = 0; n < nctids.length; n++){
                    nctCount.push(nctids[n]);
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
        
            container.parents(".trials-section").siblings(".pipeline-ref-section").removeClass('no-card');
            if(container.parents(".therapeuticAreasContainer").height() == 0) {
                container.parents(".trials-section").siblings(".pipeline-ref-section").addClass('no-card');
            }

            // let uniqueNames = getUnique(nctCount);
            // let count = uniqueNames.length;
            // console.log('count filter-js', count);
            // if(count != 1){
            //     $('.trial-count').text('Displaying '+count+' trials.');
            // }else{
            //     $('.trial-count').text('Displaying '+count+' trial.');
            // }
        }, 1000);
    };

    /**
     * Returns the array of selectors of filters that have been applied so far.
     * @returns {*[]|*}
     */
    this.getSelectedInputs = function() {
        let filterValue = container.data('filterValue');
        if(filterValue == '*' || filterValue == undefined) {
            return [];
        }

        return filterValue.split(", ");
    };

    /**
     * Returns the array of buttons (with text value to be shown in the pill)
     * @returns {[]}
     */
    this.getSelectedValues = function(filter) {
        let wrapper = getWrapper(filter);
        let selectedInputs = this.getSelectedInputs();
        $('#dieses li').removeClass('disabled');
        let selectedValues = [];
        let checker = [];
        for (let i = 0; i < selectedInputs.length; i++) {
            let value = selectedInputs[i];
            let values = value.split(".");
            for(let i=1; i<values.length; i++) {
                value = `.${values[i]}`;
                // console.log(value);
                let input = wrapper.find(`input[value='${value}']`);
                // console.log(input);
                if(!input.length || input.hasClass("skipValue")) {
                    continue;
                }
                let textValue = input.attr("data-name");
                let buttons = $(`<a value="${value}" class="removeFilter ${value} ">${textValue}</a>`);

                if(!checker.includes(value)) {
                    selectedValues.push(buttons);
                    checker.push(value);
                    $('#dieses').find(value).addClass('disabled');
                }
            }
        }

        return selectedValues;
    };

    /**
     * Function to update the filter input from some external trigger
     * @param enable: true/false
     * @param filter: selector to target specific section
     */
    this.updateInputs = function (enable, filter=false) {
        const wrapper = getWrapper(filter);

        wrapper.find(`input[type='${type}']`).prop("checked", enable);

        // console.log(wrapper);
        let filtersAdded = {};
        inputContainer.find(`input[type='${type}']`).each(function () {
            const name = $(this).attr("name");
            if (!filtersAdded[name]) {
                filtersAdded[name] = [];
            }
        });
        inputContainer.find(`input[type='${type}']:checked`).each(function () {
            const name = $(this).attr("name");
            const value = $(this).val();
            if(!$(this).hasClass("skipValue")) {
                filtersAdded[name].push(value);
            }

        });

        // console.log(filtersAdded);
        for( filter in filtersAdded ) {
            UTILITY.updateQueryString(location.href, filter, filtersAdded[filter].join(","));
        }
    };

    this.updateInput = function (input, enable) {
        inputContainer.find(`input[value='${input}']`).prop("checked", enable);
    };

    /**
     * Function to set skipValue for certain input. This prevents returning in getSelectedValues
     * @param skipValue true/false
     * @param filter: selector to target specific section
     */
    this.setSkipValue = function (skipValue, filter=false) {
        const wrapper = getWrapper(filter);
        // console.log(skipValue);
        // console.log(wrapper.find(`input[type='${type}']`));
        if(skipValue) {
            wrapper.find(`input[type='${type}']`).addClass("skipValue");
        } else {
            wrapper.find(`input[type='${type}']`).removeClass("skipValue");
        }

    };

    /**
     * Function to determine if all the inputs are selected
     * @param filter: selector to target specific section
     * @returns {boolean}
     */
    this.isSelectAll = function (filter) {
        const wrapper = getWrapper(filter);

        const totalInputs = wrapper.find(`input[type='${type}']`);
        const selectedInputs = wrapper.find(`input[type='${type}']:checked`);


        return totalInputs.length == selectedInputs.length;
    };

    /**
     * returns the type of the filter input (checkbox/radio etc)
     * @returns {*}
     */
    this.getType = function() {
        return type;
    };

    this.setViews = function () {
        views = obj.getViews();
    };

    this.setFilters = function(){
        let inputs = [];
        inputContainer.each(function() {
            const filter = $(this).find(`input[type='${type}']`).attr("name");
            if(filter && !inputs.includes(filter)) {
                inputs.push(filter);
            }
        });

        let value = [];
        for (let n in inputs) {
            const name = inputs[n];
            const values = UTILITY.getQueryString(location.href, name);
            if(values) {
                value.push(decodeURIComponent(values).split(","));
            }
        }

        let filterValue = "*";
        if(value.length == 1) {
            filterValue = value[0].join(", ");
        } else if (value.length > 1) {
            if(relation == "OR") {
                value = [].concat.apply([], value);
                filterValue = value.join(", ");
            } else if(relation == "AND") {
                filterValue = value.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
                filterValue = filterValue.map(a => a.join('')).join(", ")
            }
        }

        this.update(filterValue);
    };

    function resetSkipValue() {
        inputContainer.find(`input[type='${type}']`).removeClass("skipValue");
    }

    function getWrapper(filter) {
        let wrapper = inputContainer;
        if(filter) {
            wrapper = inputContainer.filter(`.${filter}`);
        }
        return wrapper;
    }
};

module.exports = Filter;
