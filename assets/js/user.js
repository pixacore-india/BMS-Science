let API = require('./api');

function User(user) {
    let id = user.id,
        title,
        firstName,
        lastName,
        npi,
        salutation,
        email,
        password,
        terms,
        specialties,
        subSpecialties,
        trialEnroll,
        trialNew,
        trialStatusChanges,
        trialMolecules,
        interventions;

    let api = new API();

    this.setSpecialties = function(specialties) {

    };

    this.getId = function() {
        return id;
    }


}

module.exports = User;