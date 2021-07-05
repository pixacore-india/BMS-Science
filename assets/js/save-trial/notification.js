let Notification = function(obj) {
    let container = obj.element;

    this.show = function() {
        container.show();
    };

    this.hide = function() {
        container.hide();
    };

    this.find = function(selector) {
        return container.find(selector);
    };

    this.refresh = function(element) {
        container = element;
    };

    this.setCollection = function(collection) {
        container.find(".newCollection").html(collection);
    };
};

module.exports = Notification;