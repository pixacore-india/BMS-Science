const API = require('./api');
const api = new API();
const LocationFilter = require("./filters/location");
const { URL, URLSearchParams } = require('@lvchengbin/url');
const UTILITY = require("./utility");

function search() {

    var oldVal = UTILITY.getQueryString(window.location.href, 'orderby'),
        select = $('#customOrder');

    select.val(oldVal);
    select.change(function () {
        oldVal = UTILITY.getQueryString(window.location.href, 'orderby');
        var selVal = $(this).val();
        if (oldVal !== selVal) {
            sessionStorage.setItem("SelItem", selVal);
            UTILITY.updateQueryString(location.href, 'orderby', selVal);
            location.reload();
        }
    });
    $.uniform.update(select);



    $('.filterAppliedDetails').on('click', '.deleteIcon', (e) => {
        const filterAppTxt = $('.headerSearch .filterAppTxt .addIcon');
        const elementTarget = e.target;
        const filterParam = $(elementTarget).attr("data-filter");
        let filterAppTxtNum = parseInt(filterAppTxt.text().match(/\d+/)[0], 10);
        const newFilterAppTxt = filterAppTxt.text().replace(filterAppTxtNum, --filterAppTxtNum);
        filterAppTxt.text(newFilterAppTxt);
        $(elementTarget).parent().remove();
        UTILITY.updateQueryString(location.href, filterParam, "");

        handleSearch();
    });

    $('.adv-value').each((idx, el) => {
        const textToReplace = el.innerText.replace(/ /g, '');
        let replaceFound = { text: '' };
        let advValue = textToReplace.split(',');
        let advNewValue = '';
        if (advValue.length > 1) {
            advValue.forEach((val) => {
                let replaceFoundObj = UTILITY.advanceTooltip.find(jsonData => jsonData.val === val);
                if (replaceFoundObj) {
                    advNewValue += replaceFoundObj.text + ', '
                }
            });
        } else {
            replaceFound = UTILITY.advanceTooltip.find(jsonData => jsonData.val === textToReplace);
        }

        if (advNewValue && advValue.length > 1) {
            el.innerText = advNewValue.substring(0, advNewValue.length - 1);
        } else if (replaceFound && replaceFound.text) {
            el.innerText = replaceFound.text;
        }
    });

    const container = $(".searchBySectionCelgene");
    const celgeneDaSelected = container.find(`[data-filter=celgene_da]`);
    const celgeneMolSelected = container.find(`[data-filter=celgene_mol]`);
    const dataSpecialityOnLoadDa = container.find("[data-filter=celgene_da]").attr('data-specialty') || "";
    const dataSpecialityOnLoadMol = container.find("[data-filter=celgene_mol]").attr('data-specialty') || "";

    if (dataSpecialityOnLoadDa) {
        container.find(`[data-filter=celgene_da] option[data-specialty=${dataSpecialityOnLoadMol}]`).removeAttr('disabled').show();
        container.find(`[data-filter=celgene_mol] option[data-specialty*=${dataSpecialityOnLoadMol}]`).removeAttr('disabled').show();
    } else {
        container.find(`[data-filter=celgene_da] option`).removeAttr('disabled').show();
        container.find(`[data-filter=celgene_mol] option`).removeAttr('disabled').show();
    }



    container.find('.customSelect').change((e) => {
        const elementTarget = e.target;
        const slug = elementTarget.value;
        const filter = elementTarget.getAttribute('data-filter');
        const filterSpecialty = elementTarget.options[elementTarget.options.selectedIndex].getAttribute('data-specialty');
        if (filter === 'specialty') {
            specialityUpdateView(e);
        } else if (filter === 'celgene_mol') {
            moleculeUpdateView(filterSpecialty);
        } else if (filter === 'celgene_da') {
            daUpdateView(filterSpecialty);
        }
        UTILITY.updateQueryString(location.href, "filter_" + filter, slug);

        handleSearch();
    });




    $(document).find(".saveSearchBtn").click(function (e) {
        e.preventDefault();
        const elementTarget = e.target;
        // Get Url

            const href = window.location.href;
            const urlParams = new URLSearchParams(href);
            // Get Param Types
            const searchType = urlParams.get('search_type');
            // API Call to Save Search
            api.post(`user/${phpData.userId}/save-search`, {
                "search_url": href,
                "search_type": searchType,
                "noLoader": true
            }).then(function (response) {
                //location.reload();
                // elementTarget.disabled = false;
                $(document).find(".saveSearchBtn").text("Saved");
            });
        
    });

    function isSearchSaved() {
        // Get Url
        const href = window.location.href;
        const urlParams = new URLSearchParams(href);
        // Get Param Types
        const searchType = urlParams.get('search_type');
        // API Call to Save Search
        api.post(`user/${phpData.userId}/validate-save`, {
            "search_url": href,
            "search_type": searchType,
            "noLoader": true
        }).then(function (response) {
            //location.reload();
            // elementTarget.disabled = false;
            // $(document).find(".saveSearchBtn").disabled = false;
            if (response[0] != 200) {
                $(document).find(".saveSearchBtn").text("Saved");
            } 
        });
    }


    $(document).ready(function (e) {
        isSearchSaved();
    });

    const views = {
        location: new LocationFilter({
            element: $(".filterSubOption.term-location"),
            callee: "search",
            displayView: $(".filterSubOption.term-location").parents(".widget.widget_ep-facet").find(".filterList"),
            searchCallback: function (data) {
                handleSearch(data);
            }
        })
    };

    function handleSearch(loadmoreBtn) {
        let requestData = {
            'action': 'search_celgene_filters',
            'query': loadMoreTrials.posts,
            'meta': UTILITY.getParamsByPrefix(["meta_", "date_"]),
            'dist': UTILITY.getParamsByPrefix(["dis_"]),
            'filter': UTILITY.getParamsByPrefix(["filter"]),
            'page': 0,
            'orderby': UTILITY.getParams(["orderby"]),
            '_wpnonce': phpData.rest_nonce,
            'isAdminAjax': true
        };

        console.log(requestData);

        if (loadmoreBtn) {
            requestData['single'] = loadMoreTrials.single;
        }

        api.post(loadMoreTrials.ajaxurl, requestData).then(function (response) {
            getTrials(response, loadmoreBtn);
            if (!requestData['filter'].filter_location && !requestData['dist'].dis_location) {
                $('.resultContainer .resultItems').first().removeClass('open');
                $('.resultContainer .resultItems.open .resultItemsExpand').css('display', 'none');
                $('.accordianLi .showHideArrow').first().removeClass('active');
            } else {
                $('.resultContainer .resultItems').first().addClass('open');
                $('.resultContainer .resultItems.open .resultItemsExpand').css('display', 'block');
                $('.accordianLi .showHideArrow').first().addClass('active');
            }

        }).catch(function (err) {
            console.log(err);
        });
    }

    function getTrials(data, loadmoreBtn) {
        console.log(data);
        if (data) {
            var totalCount = data.total_count;
            if (data.total_count < 10) {
                // console.log('data.total_count' , data.total_count);
                $('.loadTrialButton').hide();
                // console.log('hide button');
            } else {
                $('.loadTrialButton').show();
                //console.log('show button');
            }
            $(".preloader").hide();

            if (!isNaN(totalCount)) {
                $(".trialCount").text(totalCount);
                if (totalCount == 0) {
                    $('#zeroTrails').modal('show');
                }
            }

            if (loadmoreBtn) {
                $('.resultContainer').append(function () {
                    return $(data.html).click(function (e) {
                        if ($(e.target).hasClass('showHideArrow')) {
                            check($(e.target));
                            return false;
                        }
                    })
                });
            } else {
                $('.resultContainer').html(function () {
                    return $(data.html).click(function (e) {
                        if ($(e.target).hasClass('showHideArrow')) {
                            check($(e.target));
                            return false;
                        }
                    })
                });
            }

            isSearchSaved();

            if (loadmoreBtn) {
                loadMoreTrials.current_page++;
                if (loadMoreTrials.current_page === loadMoreTrials.max_page)
                    loadmoreBtn.remove();
            }

            loadMoreTrials.posts = data.query;
            if ($(window).width() <= 767) {
                $('html, body').animate({ scrollTop: 0 }, 500);
            }
        }
    }

    function moleculeUpdateView(specialityValue) {
        const celgeneDaSelect = container.find(`[data-filter=celgene_da]`);
        let newSpecialityValues = '';
        const specialityTextValue = container.find("[data-filter=specialty] option:selected").val();
        if (specialityTextValue) {
            specialityValue = specialityTextValue;
        }
        if (specialityValue) {
            newSpecialityValues = specialityValue.split(',');
        }
        if (newSpecialityValues.length > 1) {
            celgeneDaSelect.find('option').not(':first-child').attr('disabled', 'disabled').hide();
            newSpecialityValues.forEach((newSpecialityValue) => {
                celgeneDaSelect.find(`option[data-specialty*=${newSpecialityValue}]`).not(':first-child').removeAttr('disabled').show();
            });
        } else if (specialityValue) {
            celgeneDaSelect.find(`option[data-specialty!=${specialityValue}]`).not(':first-child').attr('disabled', 'disabled').hide();
            celgeneDaSelect.find(`option[data-specialty*=${specialityValue}]`).not(':first-child').removeAttr('disabled').show();
        } else {
            celgeneDaSelect.find('option').removeAttr('disabled').show();
        }
        if (!celgeneDaSelect.val()) {
            container.find("#uniform-celgeneDiseaseAreaFilter span").text('All Diseases');
        }
    }

    function daUpdateView(specialityValue) {
        const celgeneMolSelect = container.find(`[data-filter=celgene_mol]`);
        const specialityTextValue = container.find("[data-filter=specialty] option:selected").val();
        if (specialityTextValue) {
            specialityValue = specialityTextValue;
        }
        if (specialityValue) {
            celgeneMolSelect.find(`option[data-specialty!=${specialityValue}]`).not(':first-child').attr('disabled', 'disabled').hide();
            celgeneMolSelect.find(`option[data-specialty*=${specialityValue}]`).not(':first-child').removeAttr('disabled').show();
        } else {
            celgeneMolSelect.find('option').removeAttr('disabled').show();
        }
        if (!celgeneMolSelect.val()) {
            container.find("#uniform-celgeneMoleculeFilter span").text('All Molecules');
        }
    }

    function specialityUpdateView(e) {
        const targetValue = e.target.value;

        if (celgeneDaSelected.val()) {
            celgeneDaSelected.val('');
            UTILITY.updateQueryString(location.href, "filter_" + 'celgene_da', '');
            container.find("#uniform-celgeneDiseaseAreaFilter span").text('All Diseases');
        }
        if (celgeneMolSelected.val()) {
            celgeneMolSelected.val('');
            UTILITY.updateQueryString(location.href, "filter_" + 'celgene_mol', '');
            container.find("#uniform-celgeneMoleculeFilter span").text('All Molecules');
        }

        if (!targetValue) {
            container.find(`[data-filter=celgene_da] option`).removeAttr('disabled').show();
            container.find(`[data-filter=celgene_mol] option`).removeAttr('disabled').show();
            return;
        }

        container.find(`[data-filter=celgene_da] option[data-specialty!=${targetValue}]`).not(':first-child').attr('disabled', 'disabled').hide();
        container.find(`[data-filter=celgene_da] option[data-specialty=${targetValue}]`).removeAttr('selected').removeAttr('disabled').show();
        container.find(`[data-filter=celgene_mol] option[data-specialty!=${targetValue}]`).not(':first-child').attr('disabled', 'disabled').hide();
        container.find(`[data-filter=celgene_mol] option[data-specialty*=${targetValue}]`).removeAttr('selected').removeAttr('disabled').show();
    }

    function hidden(a) {
        $(a).removeClass('active');
        $('.resultItems').removeClass('open');
        $(a).parent().find('.accordianSubUl:first').slideUp();
    }

    function visible(b) {
        $(b).parent().siblings().find('a').removeClass('active');
        $('.resultItems').removeClass('open');
        $(b).parent().parent().find('.accordianLi .accordianSubUl:visible').slideUp();
        $(b).addClass('active');
        $(b).parents('.resultItems').addClass('open');
        $(b).parent().find('.accordianSubUl:first').slideDown();
    }

    function check(c) {
        if ($(c).parent().find('.accordianSubUl:first').is(':hidden')) {
            visible(c);
        } else {
            hidden(c);
        }
    }
    // alert('Search');
    // let container = $('.result_container')
    // container.find('.nct-popup').on('click', function () {
    //     // console.log($(this).parent().parent().next('.hidden').find('.modal-content'))
    //     let dataShow = '.' + $(this).data('view');
    //     $(this).parent().parent().next('.hidden').find('.modal-content').find('li').addClass('hidden');
    //     $(this).parent().parent().next('.hidden').find('.modal-content').find(`li${dataShow}`).removeClass('hidden');
    //     let content = $(this).parent().parent().next('.hidden').find('.modal-content').clone();
    //     $("#myVideoModal .modal-dialog").empty();
    //     let closeBtn = '<button type="button" class="close" data-dismiss="modal">&nbsp;</button>'
    //     $("#myVideoModal .modal-dialog").append(closeBtn);
    //     $("#myVideoModal .modal-dialog").append(content);
    // })
}

module.exports = search;
