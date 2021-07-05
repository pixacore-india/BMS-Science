let API = require('./api');
let User = require('./user');

function trial() {
  let $ = jQuery;

  let api = new API();
  let baseRoute = '/wp-json/boldsci/v1/';

  let container;
  let popupSubmit;

	this.init = () => {
		container = $('.save-collection-trials');
		popupSubmit = $('.addButton');
    baseRoute = baseRoute + "user/"+phpData.userId;
    container.find('.addButton').on('click', this.createCollection);
		container.find('.closePopover').on('click', this.saveTrial);
		
		




		// $('.popoverBut .saveTrialBut').click(function(){
		// 	$(this).parents('.popoverBut').find('.slides:nth-child(1)').show();
		// 	$(this).parents('.popoverBut').find('.popoverContainer').slideDown();
		// 	return false;
		// });
        //
		// $('.popoverBut .closePopover').click(function(){
		// 	$(this).parents('.popoverBut').find('.popoverContainer').slideUp();
		// 	$(this).parents('.savedPopover').find('.slides').hide();
		// 	return false;
		// });

		// $('.savedPopover .createNewBut').click(function(){
		// 	$(this).hide();
		// 	$(this).parents('.collectionTitle').find('.titleTxtField').show();
		// 	return false;
		// });

		// $('.savedPopover .slides:nth-child(1) .addButton').click(function(){
		// 	$(this).parents('.slides').hide();
		// 	$(this).parents('.savedPopover').find('.slides:nth-child(2)').show();
		// 	return false;
		// });

		// $('.savedPopover .slides:nth-child(1) .deleteButton').click(function(){
		// 	$(this).parents('.collectionTitle').find('.createNewBut').show();
		// 	$(this).parents('.collectionTitle').find('.titleTxtField').hide();
		// 	return false;
		// });

		// $('.savedPopover .noThanksBut').click(function(){
		// 	$(this).parents('.slides').hide();
		// 	$(this).parents('.savedPopover').find('.slides:nth-child(1)').show();
		// 	return false;
		// });

		// $('.savedPopover .yesBut').click(function(){
		// 	$(this).parents('.slides').hide();
		// 	$(this).parents('.savedPopover').find('.slides:nth-child(1)').show();
		// 	$(this).parents('.savedPopover').find('.slides:nth-child(1) .titleTxtField').show();
		// 	return false;
		// });
	};

	this.submit = (route, params) => {
		let endpoint = baseRoute + route;
    return api.post(endpoint, params);
  };

	this.createCollection = () => {
		let textbox = container.find('.textbox');
		let params = {
      name: textbox.val()
    };
		$result = this.submit('/save-collection', params);
		$result.then(function(response) {
			//console.log(response);
			//radio buttons added this way do not work in the form.
			if(response.collection) {
				container.find('.radioElement').append(
					`<li>
						<label>
							<div class="radio"><span><input type="radio" name="save-trial-to-collection" class="customRadio" value="${response.collection.id}" checked></span></div>
							<em>${response.collection.name}</em>
						</label>`);
				textbox.val('');
			}
		});
	};

	this.saveTrial = () => {
		let collectionID = container.find('.customRadio:checked');
		if(!collectionID.length) {
			return;
		}
		let params = {
			collectionID: collectionID.val(),
      trial: $('.studyContainer').data('id'),
      notes: ''
    };
		$result = this.submit('/save-trial', params);
		$result.then(function(response) {
			//console.log(response);
			if(response.success) {
				$('.saveTrialBut').text('Saved');
			} else {
				//alert(response.message);
			}
		});
	};
	
	
}

module.exports = trial;