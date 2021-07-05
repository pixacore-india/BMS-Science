let Step = require("../../step");
class SubSpecialty extends Step{
    // figure out how to use property in class and browserify
    //errorMessage = "Please select at least one sub specialty";

    action() {
        let subSpecialties = [];
        this.container.find("li.active").each(function(){
            subSpecialties.push($(this).data('id'));
        });

        return subSpecialties;
    };

    setSpecialties(specialties) {
        this.container.find(".twoParts[data-id]").hide();
        for(let i=0; i<specialties.length; i++) {
            let specialty = specialties[i];
            this.container.find("[data-id=" + specialty + "]").show();
        }
    }

    getErrorMessage() {
        return "Please select at least one sub Speciality";
    }

    validate() {
        return true;
    }
}

module.exports = SubSpecialty;
