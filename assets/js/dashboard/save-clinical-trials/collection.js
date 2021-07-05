let API = require("../../api");

let Collection = function (obj) {
    const container = obj.element;
    const api = new API();
    const id = container.attr("data-id");

    container.on("click", ".removeTrial", function(e) {
        e.preventDefault();

        let trial = $(this).parents("tr");
        api.post(`user/${phpData.userId}/remove-trial`, {
            collectionID: id,
            trial: trial.attr("data-id")
        }).then(function(response) {
            location.reload();
            obj.views().unsorted.addTrial(response.template);
            trial.remove();
        });
    });

    container.on("click", ".popoverBut .editIcon", function () {
       
            let collectionName = $(this).parent().find("h4 a").text();
            let trimtext = collectionName.replace(/\s/g,'');
            $(this).parents('.popoverBut').find(".popoverContainer .textbox").val(trimtext);
            $(this).parents('.popoverBut').find('.popoverContainer').slideDown();
            container.find("#editCollectionInput-error").html("");
			return false;		
    });
	
	container.on("click", ".popoverBut .closePopover", function () {
       	$(this).parents('.popoverBut').find('.popoverContainer').slideUp();
        return false;
    });

    this.addItem = function(trial) {
        container.find("tbody").append(trial);
    };
	
	container.find('.popoverBut .savedClinicalPopup .buttonSection .okBut').click(function(){
		var textboxValue = $(this).parents('.savedClinicalPopup').find('.textbox').val();
        let labelName = container.find('.savedClinicalSectionHead').find('h4').text();
        let inputName = container.find('#editCollectionInput').val();
        
        if(labelName == inputName || inputName == ""){
            let message = "Please change collection name";
            showError(message);
            return false;
        }
        
        api.post(`user/${phpData.userId}/rename-collection`, {
            collection_id: id,
            collection_name: textboxValue
        }).then(function(response) {
            //console.log(response);
            var responseId = response[Object.keys(response)[0]];
            var message = response[Object.keys(response)[2]];
            if(responseId == 200){
                $(this).parents('.popoverBut').find('.popoverContainer').slideUp();
                $(this).parents('.savedClinicalSectionHead').find('h4').text(textboxValue);
				location.reload();
            }else{
                showError(message);
            }
        });
    });

    function showError(message){
        container.find("#editCollectionInput").removeClass('valid');
        container.find("#editCollectionInput").addClass('error');
        container.find("#editCollectionInput-error").show();
        container.find("#editCollectionInput-error").html(message);
    }
    
    // container.find("form").validate({
    //     rules: {
    //         editCollectionText: "required"
    //     },
    //     messages: {
    //         editCollectionText: "Collection cannot be blank"
    //     }
    // });



};

module.exports = Collection;
