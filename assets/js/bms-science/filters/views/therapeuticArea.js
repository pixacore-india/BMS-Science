let TherapeuticArea = function(obj) {
    const {container} = obj;
    let views = false;
    const self = this;

    container.find("input[type='radio']").change(function() {
        self.hide();
        views.diseaseArea.update($(this).val());
    });

    this.hide = function() {
        container.hide();
    };

    this.show = function() {
        container.show();
    };

    this.reset = function() {
        container.find("input[type='radio']").prop('checked', false);
        this.show();
    };

    this.setViews = function () {
        views = obj.getViews();
    }
};

module.exports = TherapeuticArea;
