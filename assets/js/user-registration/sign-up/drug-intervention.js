let Step = require("../../step");

class DrugIntervention extends Step{
    action() {
        let interventions = [];
        this.container.find(".intervention").each(function() {
            if($(this).val()) {
                interventions.push($(this).val());
            }
        });

        return interventions;
    };

    getErrorMessage() {
        return "Please select at least one sub specialty";
    }

    validate() {
        return true;
    }
}

module.exports = DrugIntervention;
