let API = require("../../api");

let Speciality = function(obj) {
    const container = obj.element;
    const api = new API();
    // Remove Speciality Content
    container.on('click', '.specialityBtn', function (e) {
        e.preventDefault();

        const textSpeciality = $(this).text();
        const dataId = $(this).attr("data-id");

        $(this).parents(`[data-specialty-id="${dataId}"]`).remove();

        const li = `<li><a href="javascript:void(0);" data-id="${dataId}">${textSpeciality}</a></li>`;
        container.find(".addSpecBody ul").prepend(li);
        phpData.specialityChanged = '.specialtySelection';
    });

    container.on('click', '.addSpecBody ul li a', function (e) {
        e.preventDefault();

        const textSpeciality = $(this).text();
        const dataId = $(this).attr("data-id");

        $(this).parent().remove();

        const tr = container.find(`.specialityDataCollection tr[data-specialty-id="${dataId}"]`).clone();
        tr.find(".specialityBtn").addClass("active");
        tr.find(".lfBorder a").removeClass("active");
        phpData.specialityChanged = '.specialtySelection';
        container.find("table.specialitySelectionItems tbody").append(tr);
        container.find(".specialityDataCollection tr a").removeClass("active");
    });

    container.on('click', '.selectionLink', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        phpData.specialityChanged = '.specialtySelection';
    });

     // Save Button Click Event
     container.parent().find(".saveSpecialityButton").click((e) => {
        e.preventDefault();

        saveSpeciality();
    });

    // Save Function to create Object
    saveSpeciality = () => {
        const sendSpecialityData = {specialty: [], subspecialty: []}

        const selectedSpecialties = [];
        container.find(".specialitySelectionItems td.rhtBorder .active").each(function(){
            selectedSpecialties.push($(this).data('id'));
        });
        const subSpecialties = [];

        container.find(".specialitySelectionItems td.lfBorder .active").each(function(){
            subSpecialties.push($(this).data('id'));
            
        });

        api.post(`user/${phpData.userId}/save-specialties`, {
            specialties: selectedSpecialties,
            subSpecialties: subSpecialties
        }).then(function(response) {

            location.reload();
        });
    };
	
	// Save Button Click Event
    container.find(".saveBut").click(function(e) {
        e.preventDefault();

		$(this).parents('.popoverBut').find('.popoverContainer').slideDown();
    });

};

module.exports = Speciality;
