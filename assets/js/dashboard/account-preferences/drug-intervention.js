let API = require("../../api");

let DrugIntervention = function (obj) {
    const container = obj.element;
    const api = new API();
    let dom = {
        window: $(window),
        document: $(document),
        body: $('body')
    };


    // Add Button Click Event 
    container.find(".addButton").click(function (e) {
        e.preventDefault();

        const drugText = container.find('.addAdditionalDrug input').val();

        if (drugText) {
            const drugItem = `<li><span class='listTitle'>${drugText}</span><a href='javascript:void(0);' class='removeLink'>Remove</a></li>`;

            phpData.drugInterventionChanged = '.drugIntervention';
            container.find(".drugSelectionList ul").append(drugItem);
            container.find('.addAdditionalDrug input').val("");
        }
    });

    // Save Button Click Event
    container.find(".saveBut").click(function (e) {
        e.preventDefault();

        $(this).parents('.popoverBut').find('.popoverContainer').slideDown();
    });

    // Save Button Click Event
    container.find(".saveDrugSel").click(function (e) {
        e.preventDefault();
        save();
        $(this).parents('.popoverBut').find('.popoverContainer').slideUp();
    });

    // Remove Drug Inerventions
    dom.document.on('click', '.drugIntervention .drugSelectionList ul li .removeLink', function (e) {
        e.preventDefault();
        phpData.drugInterventionChanged = '.drugIntervention';
        $(this).parent().remove();
    });

    // Save Function to create Object
    save = () => {
        let interventions = [];
        container.find(".drugSelectionList li").each(function () {
            let value = $(this).find("span.listTitle").text();
            if (value) {
                interventions.push(value);
            }
        });
        // 
        api.post(`user/${phpData.userId}/save-interventions`, {
            interventions: interventions
        }).then(function (response) {
            location.reload();
        });
    }

};

module.exports = DrugIntervention;