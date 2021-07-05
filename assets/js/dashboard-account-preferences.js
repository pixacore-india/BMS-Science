let API = require("./api");
let Specialty = require("./dashboard/account-preferences/specialty");
let TrialOfInterest = require("./dashboard/account-preferences/trial-of-interest");
let DrugIntervention = require("./dashboard/account-preferences/drug-intervention");
let EditName = require("./dashboard/account-preferences/edit-name");

let dashboardAccountPreferences = function () {
    let $ = jQuery;

    const api = new API();
    const container = $(".accPreferencesCont");
    const formFields = $(".formField");

    const views = {
        specialty: new Specialty({
            element: container.find(".specialtySelection")
        }),
        trialOfInterest: new TrialOfInterest({
            element: container.find(".clinicalInterestType")
        }),
        drugIntervention: new DrugIntervention({
            element: container.find(".drugIntervention")
        }),
        editName: new EditName({
            element: container.find(".accInfoBx")
        })
    };

    $('a').click(e => {

        if (e.target.href && e.target.getAttribute('href') !== '#' && !e.target.getAttribute('href').includes('javascript')) {
            const targetToNaviate = e.target.href;
            if (phpData.specialityChanged) {
                e.preventDefault();
                container.find(phpData.specialityChanged).find('.popoverContainer').slideDown();
            }

            if (phpData.clinicalInterestChanged) {
                e.preventDefault();
                container.find(phpData.clinicalInterestChanged).find('.popoverContainer').slideDown();
            }

            if (phpData.drugInterventionChanged) {
                e.preventDefault();
                container.find(phpData.drugInterventionChanged).find('.popoverContainer').slideDown();
            }

            container.find('.whiteContainer .cancelBut').click((e) => {
                location.assign(targetToNaviate);
            });
        }
    });

    $('.deleteAccountContainer').find('.confirmDeleteAcc').click(() => {
        //rest api to confirm deletion
        //if ajax requests status is 200
        const password = formFields.find('#delete-confirm-password').val();
        const email = formFields.find('#user-email').val();
        if (password) {
            api.delete(`user/${phpData.userId}/delete-account`, {
                current_password: password,
                user_email: email
            }).then((res) => {
                if (!res.success) {
                    //show error message.
                }

                if (res.success) {
                    location.href = res.redirect_url;
                }
            }).catch(function(err) {
                //toaster for please enter password
            });
        } else {
            //toaster for please enter password
        }
    });



    // Sign-up Page Account-preference show and hide function
    $(document).ready(function () {
        $(".editIcon").on('click',function(labels) {
            
            if($(".title-label")[0].innerText=== "Title:"){
                $(".hidden_label").hide();
            }
           
        });
        $(".hidden_label").show().css("opacity", "1");
        $(".salutation-acc-pref").change(function (element) {
            $(".hidden_label").show().css("opacity", "1");
            if (element.target.value) {
                
                $(".hidden_label").show().css("opacity", "1");
            } else {
                $(".hidden_label").hide();
            }
        });

    });

 
};

module.exports = dashboardAccountPreferences;
