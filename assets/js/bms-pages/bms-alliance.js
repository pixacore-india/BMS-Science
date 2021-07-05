require('bootstrap');

let CelgeneAlliance = function(obj) {
    let $ = jQuery;
    const container = $(".alliancePatners");
    const allianceContent = $(".contentAlliacne");
    const modal = $("#myModal");
    const headerText = modal.find(".allianceHeaderText");
    const allianceDesc = modal.find(".allianceDesc");
    const alliancePartnerListContainer = container.find(".alliancePartnerListContainer");
    let appliedFilter = [];

    container.on('click', '.filterBtn', function (e) {		
        e.preventDefault();		
        $(this).toggleClass("active");  
        let filterName = $(this).attr('rel');
        if($(this).hasClass('active')) {
            appliedFilter.push(filterName);
        } else {
            let index = appliedFilter.indexOf(filterName);
            if (index > -1) {
                appliedFilter.splice(index, 1);
            }
        }

        if(appliedFilter.length == 0){
            alliancePartnerListContainer.find("a").css('opacity',1);
            return false;
        }
        

        container.toggleClass(appliedFilter);
        alliancePartnerListContainer.find("a").css('opacity',0.2);
        
        alliancePartnerListContainer.find("a").each(function() {
           
            dataTermList = $(this).attr("data-terms").split(", ");
            let activePartners = appliedFilter.filter(x => dataTermList.includes(x));
            if(activePartners.length){
                $(this).css('opacity',1);
            }
        });

        e.stopPropagation();
    });	
    
    container.on('click', '[data-toggle="modal"]', function (e) {
        if($(this).css("opacity") < 1){
            return false;
        }
		
        let modalImage = $(this).attr("data-logo");
        var arrayText = $(this).attr("data-therapeutic-areas");
        let therapauticAreaTxt = arrayText.toString();
        let collaborationOverviewTxt = $(this).attr("data-collaboration-overview");
        let moleculeTxt = $(this).attr("data-molecules");
        let natureOfCollaborationTxt = $(this).attr("data-nature");
        let collaborationtherapauticAreaTxt = $(this).attr("data-therapeutic");
        let regularDataText = $(this).attr("data-regular-content");	
        let imageOne = $(this).attr("data-side-image-1");	
        let imageTwo = $(this).attr("data-side-image-2");	
        
        if(collaborationOverviewTxt == ""){
            modal.find(".collaborationOverviewLabel").hide();
        }else{
            modal.find(".collaborationOverviewLabel").show();
        }

        if(moleculeTxt == ""){
            modal.find(".molecules").hide();
        }else{
           modal.find(".molecules").show();
        }

        if(natureOfCollaborationTxt == "" && collaborationtherapauticAreaTxt == ""){
            $(".regularContentData").show();
            $(".noRegularContentData").hide();
        }else{
            $(".regularContentData").hide();
            $(".noRegularContentData").show();
            $(".noRegularContentData .nature").show();
            $(".noRegularContentData .collaboration").show();
        }
        if(natureOfCollaborationTxt == ""){
            $(".noRegularContentData .nature").hide();
        }
        if(collaborationtherapauticAreaTxt == ""){
            $(".noRegularContentData .collaboration").hide();
        }

        
            $("#myModal img.ImagePhonePopUp").attr("src", modalImage);
            $("#myModal .thumbImg img.imageOne").attr("src", imageOne);
            $("#myModal .thumbImg img.imageTwo").attr("src", imageTwo);
            
            var therapauticArea = therapauticAreaTxt;
            therapauticArea = therapauticArea.replace(/-/g, ' ');
            headerText.find(".therapeuticAreas").html(therapauticArea);
            headerText.find(".collaborationOverview").html(collaborationOverviewTxt);
            headerText.find(".molecules").html(moleculeTxt);
            allianceDesc.find(".natureOfCollaboration").html(natureOfCollaborationTxt);
            allianceDesc.find(".collaborationtherapauticArea").html(collaborationtherapauticAreaTxt);
            allianceDesc.find(".regularContentDataText").html(regularDataText);
    })
	
	allianceContent.find('.alliancePatners .rowCustom .allianceDropDown .clearAllText a').click(function () {		
		$(this).parents('.checkbox').find('.filterBtn').removeClass('active');
		$('.alliancePatners').removeClass('preClinical clinical hematologic oncology tumor');
		$('.alliancePartnerListContainer a').removeClass('fadeOut').addClass('fadeIn');
		return false;
	});	
	
	allianceContent.find('.allianceDropDown ul > li > a').click(function (e) {		
		e.stopPropagation();
		if (!$(this).parent('li').find('ul').hasClass('open')) {
            $('.allianceDropDown ul > li > a').removeClass('active');
            $('.allianceDropDown li ul').removeClass('open').hide();
            $(this).parent('li').find('ul').addClass('open').show();
            $(this).addClass('active');
        } else {
           $('.allianceDropDown ul > li > a').removeClass('active');
            $(this).parent('li').find('ul').removeClass('open').hide();
        }		
	});

};

module.exports = CelgeneAlliance;