let Collection = require("./dashboard/save-clinical-trials/collection");
let Unsorted = require("./dashboard/save-clinical-trials/unsorted");
let API = require("./api");

let dashboardSavedClinicalTrials = function () {
    let $ = jQuery;
    const api = new API();
    const container = $(".savedClinicalContainer");

    const views = {
        unsorted: new Unsorted({
            element: container.find(".unsortedTrials"),
            views: function getVeiws() {
                return views;
            }
        }),
        collections: []
    };

    container.find(".savedClinicalItems").each(function () {
        let collectionId = $(this).attr("data-id");
        views.collections[collectionId] = new Collection({
            element: $(this),
            views: function getVeiws() {
                return views;
            }
        });
    });


    container.on("click", ".deleteTrial", function (e) {
        e.preventDefault();

        let trialId = $(this).parents("tr").attr("data-id");
        api.delete(`user/${phpData.userId}/unsave-trial`, {
            trial_id: trialId
        }).then(function (response) {
            location.reload();
        });
    });

    $('.collection .savedClinicalContainer .savedClinicalCont').on("click", ".addIconAccord", function (e) {

        if (!$(this).parents('tr').next('tr.collectionHide').hasClass('showTr')) {
            $('.collection .savedClinicalContainer .savedClinicalCont .addIconAccord').removeClass('active');
            $('.collection .savedClinicalContainer .savedClinicalCont tr.collectionHide').removeClass('showTr');
            $(this).parents('tr').next('tr.collectionHide').addClass('showTr');
            $(this).addClass('active');
        } else {
            $('.collection .savedClinicalContainer .savedClinicalCont .addIconAccord').removeClass('active');
            $(this).parents('tr').next('tr.collectionHide').removeClass('showTr');
        }


    });

};

module.exports = dashboardSavedClinicalTrials;