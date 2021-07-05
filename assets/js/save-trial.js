let API = require('./api');
let Collection = require('./save-trial/collection');
let Notification = require('./save-trial/notification');
let Unsave = require('./save-trial/unsave');

let SaveTrial = function (obj) {
    let $ = jQuery;
    const api = new API();
    let collection = {
        name: "Unsorted List",
        id: ""
    }; // check whether you need an ID or name will do?
    let isLoading = false;
    let trialId;
    let container = $(".saveCollectionTrials");
    // let resultContainer = $(".resultContainer");
    let resultContainer = obj.element;
    let containerDetail = $(".savedClinicalDetailCont");
    let modal;
    let showNotification = false;
    let reloadPage = false;
    let newTarget = '';


    $(document).ajaxStop(function () {
        isLoading = false;
        if (newTarget && newTarget !== '#' && !newTarget.includes('s=')
            && !newTarget.includes('trial')
            && !newTarget.includes('dashboard')) {
            location = newTarget;
        }
        
        if (reloadPage) {
            location.reload();
        }
        

    });

    $(document).ajaxStart(function () {
        isLoading = true;
    });

    /* window.addEventListener("beforeunload", (e) => {
         // Cancel the event
       if(e.target.href.include('bolderscience')) {

       }
     });*/

    $('a').click((e) => {
        if (e.target.className.includes('saveTrialBut')) {
            isLoading = true;
        }
        if (isLoading) {
            e.preventDefault();
            if (e.target.href !== '#') {
                newTarget = e.target.href;
            }
        }
    });
    resultContainer.on("click", ".saveTrialBut", function (e) {
        e.preventDefault();
        e.target.innerText = 'Unsave';
        trialId = $(this).attr("data-trial-id");
        modal = $(".saveCollectionTrials").filter(`[data-trial-id="${trialId}"]`).find(".unSavedPopover, .savedPopover");
        views.refresh();
        views.toggle("collection");
        modal.slideDown();
    });

    resultContainer.on("click", '.unSaveTrialBut', function (e) {
        e.preventDefault();
        trialId = $(this).attr("data-trial-id");
        views.refresh();
        views.unsave.show(trialId);
    });


    resultContainer.on("click", '.closePopover', function (e) {
        e.preventDefault();
        closePopOver(e);
    });


    //update Query params
    let updateQueryString = (uri, key, value, action) => {
        const re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
        let newUri = uri;
        if (uri.match(re)) {
            newUri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            if (uri.indexOf('#') !== -1) {
                uri = uri.replace(/#.*/, '');
            }
            const separator = uri.indexOf('?') !== -1 ? "&" : "?";
            newUri = uri + separator + key + "=" + value;
        }
        if (action === 'val') {
            return newUri;
        }
        if (action === 'history') {
            history.pushState({}, null, newUri);
        }

    };

    resultContainer.on('click', '.trialNotification', function (e) {
        e.preventDefault();

        let setReceiveNotification = $(this).hasClass("yesBut") ? 1 : 0;
        reloadPage = true;
        trialId = $(".saveCollectionTrials").find(".saveTrialBut").attr("data-trial-id");
        api.post(`user/${phpData.userId}/email-notification`, {
            trial_id: trialId,
            email_setting: setReceiveNotification
        }).then(function (response) {
            //console.log(response);
            killModal(setReceiveNotification);
        });


    });


    resultContainer.on("change", '[name="save-trial-to-collection"]', function (e) {
        collection = {
            name: $(this).parents(".radio").next().html(),
            id: $(this).val()
        }
    });

    let views = {
        collection: new Collection({
            element: container.find(".slides:nth-child(1)")
        }),
        notification: new Notification({
            element: container.find(".slides:nth-child(2)")
        }),

        unsave: new Unsave({
            element: container.find(".unSavedPopover")
        }),

        hide: function () {
            this.collection.hide();
            this.notification.hide();
        },

        refresh: function () {
            this.collection.refresh(resultContainer.find(".slides:nth-child(1)"));
            this.notification.refresh(resultContainer.find(".slides:nth-child(2)"));
            // this.bindEvents();
        },

        toggle: function (view) {
            this.hide();
            this[view].show();
        }
    };


    resultContainer.on('click', '.addButton', (function (e) {
        e.preventDefault();
        let tempCollection = views.collection.getCollection(e);
        if (isEmpty(tempCollection)) {
            // alert("Please enter a Collection name");
            return false;
        }

        collection.name = tempCollection;
        api.post(`user/${phpData.userId}/save-collection`, {
            name: tempCollection
        }).then(function (response) {
            collection.id = response.collection.collection_id;
            views.collection.addItem(collection);
        });
    }));

    containerDetail.on('click', '.deleteIcon', function (e) {
        e.preventDefault();
        reloadPage = true;
        trialId = $(this).parents("tr.showTr").attr("data-id");
        api.delete(`user/${phpData.userId}/unsave-trial`, {
            trial_id: trialId
        }).then(function (response) {
        });
    });

    containerDetail.on('click', '.btn-toggle', function (e) {
        // e.preventDefault();
        const setReceiveNotification = $(this).find('button.active').find('span').text() === 'OFF' ? 0 : 1;
        //console.log("Needs collection id to gsave notification", setReceiveNotification);
        trialId = $(this).parents("tr.showTr").attr("data-id");
        reloadPage = true;
        api.post("user/".concat(phpData.userId, "/email-notification"), {
            trial_id: trialId,
            email_setting: setReceiveNotification
        }).then(function (response) {
            //console.log(response);
        });
    });

    $(document).click(function (e) {
        if(!$('body').hasClass('page-template-page-saved-clinical-trials')) {
            if (!(e.target.className.includes('blueStarLink') || e.target.className.includes('addIcon') || $(e.target).parents('.popoverContainer').length) && $('.popoverContainer').is(':visible')) {
                const popoverContainer = $(".popoverContainer");
                popoverContainer.slideUp();
                showNotification = false;
                const savedPopover = $('.savedPopover');
                if (savedPopover.is(':visible')) {
                    closePopOver(e);
                }
            }
        }
    });

    

    function isEmpty(str) {
        return !str.replace(/\s+/, '').length;
    }

    function killModal(optIn) {
        if (optIn) {
            //trigger rest endpoint to save here
        }

        modal.slideUp();
        views.hide();
    }

    const closePopOver = (e) => {
        showNotification = resultContainer.find(e.target).parents('.popoverBut').find('.saveTrialBut').attr('data-show-notification') === '1';
        if (showNotification) {
            reloadPage = true;
        } else if (showNotification == 0) {
            reloadPage = true;
        }
        let collectionArr = collection.id ? [collection.id] : [];
        api.post(`user/${phpData.userId}/save-trial`, {
            trial: trialId,
            collectionID: collectionArr
        }).then(function (response) {

        });
    };


    // $('.popoverBut .closePopover').click(function(){
    // 	$(this).parents('.popoverBut').find('.popoverContainer').hide();
    // });

};

module.exports = SaveTrial;
