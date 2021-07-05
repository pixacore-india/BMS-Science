const UTILITY = require("./../../../utility");

let DiseaseArea = function(obj) {
    const {container} = obj;
    let views = false;
    let selectedTa = "";

    container.find(".back-link").click(function(e) {
        e.stopPropagation();
        container.hide();
        selectedTa = "";
        views.therapeuticArea.reset();
    });
    container.find(".therapeutic-area-filter input[type='checkbox']").on("ta-changed", function() {
        console.log("update DAs")
        // if(!$(this).parents(".therapeuticAreaFilter").hasClass("deseasesAreasFilter")) {
            const isChecked = $(this).is(":checked");
            if(!selectedTa) {
                selectedTa = $(this).parents(".therapeuticAreaFilter").attr("data-ta");
            }

            console.log(selectedTa);
            views.therapeuticAreaFilter.setSkipValue(!isChecked, `${selectedTa}.update-container`);
            views.deseasesAreasFilter.setSkipValue(isChecked, `${selectedTa}.update-da-container`);

            views.deseasesAreasFilter.updateInputs(isChecked, `${selectedTa}.update-da-container`);
        // }
    });

    container.find(".disease-area-filter input[type='checkbox']").on("da-changed", function() {
        // if(!$(this).parents(".therapeuticAreaFilter").hasClass("trialFilter")) {
            if (!selectedTa) {
                selectedTa = $(this).parents(".deseasesAreasFilter").attr("data-ta");
            }
            const isSelectAll = views.deseasesAreasFilter.isSelectAll(`${selectedTa}.update-da-container`);
            const name = $(this).attr("name");

            views.deseasesAreasFilter.setSkipValue(isSelectAll, `${selectedTa}.update-da-container`);
            views.therapeuticAreaFilter.setSkipValue(!isSelectAll, `${selectedTa}.update-container`);

            views.therapeuticAreaFilter.updateInputs(isSelectAll, `${selectedTa}.update-container`);

            setTimeout(function () {
                if (isSelectAll) {
                    UTILITY.updateQueryString(location.href, name, "");
                }
            }, 2);
        // }
    });

    this.update = function(ta) {
        selectedTa = ta;
        container.attr("data-selectedTA", ta);

        container.show();
        container.find(".therapeuticArea").hide();
        container.find(`.${ta}`).show();
        // console.log(selectedTa);
    };

    this.show = function () {
        container.show();
    };

    this.hide = function () {
        container.hide();
    };

    this.setViews = function () {
        views = obj.getViews();
    }
};

module.exports = DiseaseArea;
