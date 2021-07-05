let API = require("../../api");

let TrialOfInterest = function(obj) {
    const container = obj.element;
    const api = new API();

    // Save Trials Intervention Button Click Event 
    container.find(".saveTrialInterestButton").click(function(e) {
        e.preventDefault();

        saveTrialInterest();
    });

    // Save Function 
    saveTrialInterest = () => {
        const data = {};
        container.find("[name]").each(function() {
            data[$(this).attr("name")] = $(this).val();
        });

        api.post(`user/${phpData.userId}/save-trials-of-interest`, {
            trials_of_interest: data
        }).then(function(response) {
            location.reload();
        })
    }
	
	// Save Button Click Event
    container.find(".saveBut").click(function(e) {
        e.preventDefault();

		$(this).parents('.popoverBut').find('.popoverContainer').slideDown();
    });



    container.find('.rangeSlider').change((e) => {
        phpData.clinicalInterestChanged = '.clinicalInterestType';
    })

};

module.exports = TrialOfInterest;