let ViewAll = function(obj) {
    let {container, onViewAll} = obj;
    let rows = container.find(".phaseContainer .phaseRow");
    let parentHidden = true;
    const self = this;
    let visibleCards = [];

    container.find(".viewDisplayBx .viewAllBut").on('click', function() {
        refreshCardView(true);
        
        if(!$(this).hasClass("active")){
            $('html, body').animate({
                scrollTop: container.offset().top - 100 // Use the id of your destination on the page
            }, 200);
        }
    });

    this.update = function(selectedInputs = [], selectedCards = []) {
        container.find(".cardContent").show();
        container.find(".trialContainer").show();
        container.find(".cardNoResult").hide();
        rows.removeClass("selectedItem");
        if(selectedInputs.length) {
            for(let i = 0; i < selectedInputs.length; i++) {
                let value = selectedInputs[i];
                rows.each(function(index) {
                    $(this).parent().find(value).show();
                    $(this).parent().find(value).addClass("selectedItem");
                });
            }
        } else {
            rows.addClass("selectedItem");
        }

        visibleCards = selectedCards;

        return refreshCardView(false);
    };

    this.showEmptyMessage = function() {
        container.show();

        if(container.parents(".therapeuticAreasItem").length) {
            container.parents(".therapeuticAreasItem").data("hidden", 0)
            container.parents(".therapeuticAreasItem").show();
        }

        container.find(".cardContent").hide();
        container.find(".trialContainer").hide();
        container.find(".cardNoResult").show();

        onViewAll();
    };

    this.showNoResults = function () {
        if(container.parents(".therapeuticAreasItem").length && visibleCards.length) {
            container.addClass('bms-trials-noResult');
            container.find(".cardNoResult").show();
            container.find(".disease-header").hide();
            container.find(".viewDisplayBx").hide();
        } else {
            container.hide();
        }
        onViewAll();
    };

    this.hideNoResults = function () {
        if(container.parents(".therapeuticAreasItem").length && visibleCards.length) {
            container.removeClass('bms-trials-noResult');
            container.find(".cardNoResult").hide();
            container.find(".disease-header").show();
        } else {
            container.show();
        }
        onViewAll();
    };

    this.toggleParent = function () {
        if(container.parents(".therapeuticAreasItem").length) {
            const count = container.parents(".therapeuticAreasItem").data("hidden");
            const cards = container.parents(".therapeuticAreasItem").find(".card").length;
            if(cards == count) {
                container.parents(".therapeuticAreasItem").addClass("bms-trials-noResult-all");
                if(!visibleCards.length) {
                    container.parents(".therapeuticAreasItem").hide();
                }
            }
        }

        onViewAll();
    };

    this.isParentHidden = function () {
        return parentHidden;
    };

    this.resetParent = function() {
        container.parents(".therapeuticAreasItem").data("hidden",0);
        container.parents(".therapeuticAreasItem").data("checker",0);
        container.parents(".therapeuticAreasItem").show();
        container.parents(".therapeuticAreasItem").removeClass("bms-trials-noResult-all");
        container.parents(".therapeuticAreasItem").show();
        container.show();
        visibleCards = [];
    };

    function refreshCardView(isClick = false) {
        let isHidden = false;
        let selectedRows = rows.filter(".selectedItem");
        let ele = container.find(".viewDisplayBx .viewAllBut");
        let checker = container.parents(".therapeuticAreasItem").data("checker") ? Number(container.parents(".therapeuticAreasItem").data("checker")): 0;
        container.parents(".therapeuticAreasItem").data("checker", checker+1);
		container.show();
 container.find(".phaseContainer .phaseRow:not(.selectedItem)").hide();
 selectedRows.show();
        if(selectedRows.length == 0){
            self.showNoResults();
            isHidden = true;
            parentHidden = true;
            let count = container.parents(".therapeuticAreasItem").data("hidden") ? Number(container.parents(".therapeuticAreasItem").data("hidden")): 0;
            container.parents(".therapeuticAreasItem").data("hidden", count+1);
        } else if(selectedRows.length <= 5){
            container.find(".viewDisplayBx").hide();
            self.hideNoResults();
            parentHidden = false;
        } else {
            container.find(".viewDisplayBx").show();
            parentHidden = false;
        }

        let textEle = container.find(".displayTxt .phaseShow");
        let textTotal = container.find(".displayTxt .phaseTotal");
        let isActive = ele.hasClass("active");

        textEle.text(!isClick || isActive ? "5" : selectedRows.length);
        textTotal.text(selectedRows.length);
        ele.html(!isClick || isActive ? "Expand All" : "Collapse");
        ele.toggleClass("active", isClick && !isActive);

        if(!isClick || isActive) {
            selectedRows.filter(function(index) {
                return index > 4;
            }).hide();
        } else {
            selectedRows.show();
            if($(window).width() < 768){
                selectedRows.css({display:'block'})
            }
        }
        // raise event for the parent
        if(isClick) {
            onViewAll();
        }

        return isHidden;
    }

    this.update();
};

ViewAll.showEmptyMessage = function () {
    $(".cardContent").hide();
    $(".trialContainer").hide();
    if($(".trialContainerP").length){
        $(".trialContainerP").hide();
        $(".cardNoResult").addClass('bms-trials-noResult-show');
    }
};

ViewAll.hideEmptyMessage = function () {
    $(".cardContent").show();
    $(".trialContainer").show();
    if($(".trialContainerP").length){
        $(".trialContainerP").show();
        $(".cardNoResult").removeClass('bms-trials-noResult-show');
    }
};

module.exports = ViewAll;
