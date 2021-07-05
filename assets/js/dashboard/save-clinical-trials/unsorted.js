let Collection = require('../../save-trial/collection');
let Notification = require('../../save-trial/notification');
let API = require('../../api');

let Unsorted = function (obj) {
    const container = obj.element;
    const api = new API();
    let modal;
    let trialId;

    let collection = {
        name: "Unsorted List",
        id: ""
    }; // check whether you need an ID or name will do?


    container.on("click", ".addIcon", function(e) {
        e.preventDefault();
        modal = container.find(".unSavedPopover, .savedPopover");
        trialId = $(this).parents("tr").attr("data-id");

        $(this).parent().find(".savedPopover").show();
        $(this).parent().find(".savedPopover .slides:nth-child(1)").show();
        $(this).parent().find(".savedPopover .slides:nth-child(2)").hide();
        //views.toggle("collection");
        //modal.slideDown();

    });

    let views = {
        collection: new Collection({
            element: container.find(".slides:nth-child(1)")
        }),
        notification: new Notification({
            element: container.find(".slides:nth-child(2)")
        }),

        hide: function() {
            this.collection.hide();
            this.notification.hide();
        },

        toggle: function(view) {
            this.hide();
            this[view].show();
        },

        refresh: function() {
            this.collection.refresh(container.find(".slides:nth-child(1)"));
            this.notification.refresh(container.find(".slides:nth-child(2)"));
            this.bindEvents();
        },

        bindEvents: function() {
            this.collection.off();

            this.collection.on("click", ".closePopover", function (e) {
                e.preventDefault();

                if (!collection.id) {
                    return;
                }

                api.post(`user/${phpData.userId}/move-trial`, {
                    trial_id: trialId,
                    new_collection_id: collection.id
                }).then(function (response) {
                    //console.log(response);
                    location.reload();
                    obj.views().collections[collection.id].addItem(response.template);
                    container.find(`tr[data-id="${trialId}"]`).remove();
                });
            });

            this.collection.on("change", "[name='save-trial-to-collection']", function () {
                collection = {
                    name: $(this).parents(".radio").next().html(),
                    id: $(this).val()
                }
            });

            this.collection.on("click", ".addButton", function (e) {
                e.preventDefault();

                let tempCollection = views.collection.getCollection(e);
                if (isEmpty(tempCollection)) {
                    alert("Please enter a Collection name");
                    return false;
                }

                collection.name = tempCollection;
                api.post(`user/${phpData.userId}/save-collection`, {
                    name: tempCollection
                }).then(function (response) {
                    collection.id = response.collection.collection_id;
                    views.collection.addItem(collection);
                });
            });
        }
    };

    function isEmpty(str){
        return !str.replace(/\s+/, '').length;
    }




    function close() {
        modal.hide();
        //modal.slideUp();
        views.hide();

        if(collection == "unsorted") {
            return false;
        }

        //trigger rest endpoint to move from unsorted to a given collection
    }

    this.addTrial = function(trial) {
        container.find("tbody").append(trial);
        views.refresh();
    };


    views.bindEvents();

};

module.exports = Unsorted;