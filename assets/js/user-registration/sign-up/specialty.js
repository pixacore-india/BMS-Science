let Step = require("../../step");

class Specialty extends Step{
    // figure out how to use property in class and browserify
    //errorMessage = "Please select at least one sub specialty";

    constructor(obj) {
        super(obj);

        this.shouldSkip = true;
    }

    action() {
        let selectedSpecialties = [];
        this.container.find("li.active").each(function(){
            selectedSpecialties.push($(this).data('id'));
        });

        return selectedSpecialties;
    };

    skip() {

    }

    onChange(views) {
        views.subSpecialty.setSpecialties(this.action());
    };

    getErrorMessage() {
        return "Please select at least one specialty";
    }
}

module.exports = Specialty;
