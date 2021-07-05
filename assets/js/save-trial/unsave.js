let API = require('../api');

let Unsave = function (obj) {
    let container = obj.element;
    const self = this;
    const api = new API();
    let trialId;

    this.show = function (tId) {
        trialId = tId;
        let unSaveModal = $(".saveCollectionTrials").find(".unSavedPopover").parents(`[data-trial-id="${trialId}"]`).find(".unSavedPopover, .savedPopover")
        unSaveModal.slideDown();
        unSaveModal.off();
        attachEvent(unSaveModal);
    };

    this.hide = function () {
        $(".saveCollectionTrials").find(".unSavedPopover").slideUp();
    };

    this.find = function (selector) {
        return $(".saveCollectionTrials").find(".unSavedPopover").find(selector);
    };

    const attachEvent = (target) => {


        $(target).find('.cancelBut').one('click', function (e) {
            e.preventDefault();
            self.hide();
        });

        $(target).find('.okBut').one('click', function (e) {
            e.preventDefault();
            self.hide();

            api.delete(`user/${phpData.userId}/unsave-trial`, {
                trial_id: trialId
            }).then(function (response) {
                location.reload();
            });
        });
    }
};

module.exports = Unsave;
