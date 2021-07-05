let Step = require("../../step");

class TrialOfInterest extends Step{
    action() {
        let data = {};
        this.container.find("[name]").each(function() {
            data[$(this).attr("name")] = $(this).val();
        });

        return data;
    };

    getErrorMessage() {
        return "Please select at least one sub specialty";
    }

    validate() {
        return true;
    }
}

module.exports = TrialOfInterest;
