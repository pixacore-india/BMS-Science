class Step {
    //errorMessage;

    constructor(obj) {
        this.container = obj.element;
        this.key = obj.key;

        this.shouldSkip = false;
    }

    action() {

    };

    validate()  {
        return this.action().length;
    }

    setSkip(skip) {
        this.shouldSkip = skip;
    }

    getErrorMessage() {
        return this.errorMessage;
    }
}

module.exports = Step;
