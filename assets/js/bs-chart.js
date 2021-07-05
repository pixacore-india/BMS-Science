let API = require("./api");
let DonutChart = require("./donut-chart");

function BSChart(obj) {
    if (!jQuery("canvas").length) {
        return false;
    }

    const api = new API();
    const self = this;
    let specialtyOff = false;
    let reset = false;
    let updateLegends = false;
    const is_parent_ta = $("[name='is_parent_ta']");
    const parent_ta = $("[name='parent_ta']");
   
    let userSpeciality = [];
    if( phpData.payload ) {
        userSpeciality = phpData.payload.data.request.user_specialties;
    }
    const switchBxText = $('.switchBx .switchBxText');
    const views = {
        phase: new DonutChart({
            canvasId: 'phaseChart',
            legendsId: 'phaseLegend',
            form: 'js-phase-form',
            key: 'phases',
            inputName: 'phase[]',
            cutoutPercentage: 84,
            colorSet: [getColorSet('phaseChartColor1'), getColorSet('phaseChartColor2')],
            labels: ["Phase 1", "Phase 2", "Phase 3"],
            // labels: ["Early Phase 1","Phase 1", "Phase 2", "Phase 3"],
            handleResponse: function (e) {
                handleResponse(e);
            }
        }),

        status: new DonutChart({
            canvasId: 'statusChart',
            legendsId: 'statusLegend',
            form: 'js-status-form',
            key: 'statuses',
            inputName: 'status[]',
            cutoutPercentage: 88,
            colorSet: [getColorSet('statusChartColor1'), getColorSet('statusChartColor2')],
            // labels: ["Recruiting", "Not Yet Recruiting", "Active, Not Recruiting", "Enrolling by Invitation", "Completed", "Other"],
            // labels: ["Recruiting", "Not Yet Recruiting", "Active, Not Recruiting"],
            labels: ["Recruiting", "Not Yet Recruiting"],
            handleResponse: function (e) {
                handleResponse(e);
            }
        }),

        parent: "",

        setParent: function (view) {
            this.unsetAll();
            this.parent = view;

            if (view) {
                this[view].setParent();
            }
        },
        unsetAll: function () {
            this.phase.unsetParent();
            this.status.unsetParent();
        },
        update: function (data) {
            // console.log(data)
            const parent = this.parent;
            if (!parent) {
                this.status.enableLegends(reset);
                this.phase.enableLegends(reset);

                this.phase.updateChart(data);
                this.status.updateChart(data);

                // if (updateLegends) {
                    this.phase.updateLegends(data.data.filters[this.phase.getKey()]);
                    this.status.updateLegends(data.data.filters[this.status.getKey()]);

                    updateLegends = false;
                // }

                return;
            }

            const child = parent === "status" ? "phase" : "status";
            const responseData = data.data.filters[this[child].getKey()];

            if (this[parent].hasChanged()) {
                this[child].updateLegends(responseData);
            }
            this[parent].enableLegends();

            this.phase.updateChart(data);
            this.status.updateChart(data);
        }

    };

    $(".conditionBx .btn-toggle").click(function (e) {
        specialtyOff = $(e.target.parentElement).find('button.active').text() === 'OFF' ? 0 : 1;
        $(".youSpeciality").show();
        $(".allSpeciality").hide();
	
        if(specialtyOff){
            $("#filter_conditions").val("");
            $(".youSpeciality").hide();
            $(".allSpeciality").show();
        }
        reset = true;

        handleResponse(e);
    });

    const totalWrapper = document.getElementById('js-countNumber');

    this.init = function (data, setLegends = true) {
        if (setLegends) {
            views.status.setLegends(data.data.filters.statuses);
            views.phase.setLegends(data.data.filters.phases);
        }

        this.processResponse(data);
    };

    this.update = function (request = {}) {
        this.incomingRequest = request;
        handleResponse()
    };

    this.setUpdateLegends = function (bool) {
        updateLegends = bool;
    };

    /**
     * Handle AJAX response to Elastic Search.
     */
    function handleResponse(e = {}) {
        let target = e.target;
        if (target && !views.parent) {
            if ('status[]' === target.name || 'phase[]' === target.name) {
                views.setParent(target.name.slice(0, -2));
            }
        }
        // console.log(e);
        let requestData = {
            'phase': views.phase.getCheckedLegends(),
            'status': views.status.getCheckedLegends(),
            'parent': views.parent
        };

        if (0 < phpData.da.length) {
            requestData.da = phpData.da;

        }

        // change text of view trials text and specialities
        if (!specialtyOff) {
            switchBxText.text('View trials across all specialties');
            requestData.user_specialties = userSpeciality;
        } else {
            switchBxText.text('View trials across your selected specialties');
        }

        if(is_parent_ta.length) {
            requestData['is_parent_ta'] = is_parent_ta.val();
        }

        if(parent_ta.length) {
            requestData['parent_ta'] = parent_ta.val();
        }

        $.extend(requestData, self.incomingRequest);

        obj.getViews().form.trigger("updateFilters", {
            phases: views.phase.getCheckedLegendsSearchValue().join(","),
            statuses: views.status.getCheckedLegendsSearchValue().join(",")
        });
        api.get(phpData.searchApiUrl, requestData).then(data => {
            self.processResponse(data);
        }, self.errorHandler);
    }


    function number_format(number, decimals, dec_point, thousands_sep) {
        // Strip all characters but numerical ones.
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    /**
     * Process errors.
     */
    this.errorHandler = function () {
        console.log('Ajax call was not successful.');
    };

    /**
     * Process AJAX response.
     */
    this.processResponse = function (data) {
        // Total count.
        totalWrapper.textContent = number_format(data.data.total, 0);
        // console.log(data.data.total)
        if(data.data.total == 1){
            $('.chartText').text('trial');
        }else{
            $('.chartText').text('trials');
        }
        let statusActiveCheck = views.status.isLegendSelected();
        let phaseActiveCheck = views.phase.isLegendSelected();

        if($("body").hasClass("logged-in") == true){
            if(number_format(data.data.total, 0) <= 5){
                $(".lessResultsText").css("display","block");
            }else{
                $(".lessResultsText").css("display","none");
            }
        }

        if (!statusActiveCheck && !phaseActiveCheck) {
            views.setParent("");
        } else if ('status' === views.parent && !statusActiveCheck) {
            // set phase to parent
            views.setParent("phase");
        } else if ('phase' === views.parent && !phaseActiveCheck) {
            // set status to parent
            views.setParent("status");
        }
        const celgene_input = document.getElementById('filter_celgene_da');
        if (celgene_input && data.data.request && data.data.request.celgene_da && 0 < data.data.request.celgene_da.length) {
            const all_da = data.data.request.celgene_da.map(function(da) {
               return `.${da.replace('bms-pipeline-','')}`;
            });
            celgene_input.value = all_da.join(',')
        }

        const user_specialties = document.getElementById('filter_conditions');
        if (user_specialties && data.data.request && data.data.request.user_specialties && 0 < data.data.request.user_specialties.length) {
            user_specialties.value = data.data.request.user_specialties.join(',')
        }

        views.update(data);
    };


    function getColorSet(set) {
        // For Status
        // const colorSet1 = ["#c37900", "#ba4422", "#501514", "#33d6f1", "#138967", "#097789"];
        // const colorSet2 = ["#9e6201", "#92361b", "#360e0e", "#2aaec4", "#0f6a50", "#075967"];
        const colorSet1 = ["#33d6f1", "#138967"];
        const colorSet2 = ["#4fbcd8", "#0f6b51"];
        // For Phase
        // const colorSet3 = ["#f1c248", "#ec0479", "#f6882e", "#ef5333", "#eeee13", "#ff00c3"];
        // const colorSet4 = ["#cda53d", "#c90367", "#d17427", "#cb472b", "#cbcb10", "#d900a6"];
        const colorSet3 = ["#ffd186", "#ffac24", "#df5f39", "#501515"];
        const colorSet4 = ["#deb46e", "#d8911c", "#bb4e2d", "#310c0c"];


        switch (set) {
            case 'statusChartColor1':
                return colorSet1;
            case 'statusChartColor2':
                return colorSet2;
            case 'phaseChartColor1':
                return colorSet3;
            case 'phaseChartColor2':
                return colorSet4;
            default:
                return colorSet1;
        }
    }
}

module.exports = BSChart;
