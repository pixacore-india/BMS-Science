let Collection = function(obj) {
    let container = obj.element;
    const self = this;
    //console.log('container', obj.element);
    //console.log(container.get(0));

    function bindEvents() {
        container.off();
        container.find(".createNewBut").click(function (e) {
            e.preventDefault();

            self.editBox(true); //@true: show input field.
        });

        container.find(".deleteButton").click(function (e) {
            e.preventDefault();

            self.editBox(false); //@true: show input field.
        });
    }

    this.show = function() {
        container.show();
    };

    this.hide = function() {
        container.hide();
    };

    this.refresh = function(element) {
        container = element;
        $(".customCheck").uniform();
        bindEvents();
    };

    this.off = function() {
        return container.off();
    };

    this.editBox = function(showInput) {
        container.find('.collectionTitle').toggleClass("showInput", showInput);
    };

    this.find = function(selector) {
        return container.find(selector);
    };

    this.on = function(event, selector, callback) {
        return container.on(event, selector, callback);
    };

    this.getCollection = function(e) {
        return container.find(e.target.parentElement).find('.textbox').val();
    };

    this.addItem = function(collection) {
        let item = `
            <li>
                <label class="checkBoxWhite">
                    <input type="radio" checked name="save-trial-to-collection" class="customCheck" value="${collection.id}">
                <em>${collection.name}</em>
                </label>
            </li>`;

        container.find(".radioElement").append(item);
        $(".customCheck").uniform();

        self.editBox(false);
        container.find(".collectionTitle .textbox").val("");
    };

    bindEvents();
};

module.exports = Collection;
