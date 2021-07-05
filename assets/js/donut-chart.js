function DonutChart(obj) {
    const canvas = document.getElementById(obj.canvasId);
    const key = obj.key;
    const inputName = obj.inputName;
    const handleResponse = obj.handleResponse;
    let labels = [];
    let hasChanged = false;
    canvas.addEventListener('click', e => {
        const elements = donut.getElementsAtEvent(e);

        if (elements.length === 0) {
            return;
        }

        const clickedIndex = elements[0]._index;

        const checkboxes = $(legends).find('.js-label-filter:checked');
        if(checkboxes.length > 1) {
            checkboxes.prop('checked', false);
        }
        const matchingCheckbox = legends.querySelector('.js-label-filter-' + clickedIndex);
        $(matchingCheckbox).next().click();
    });

    const chart = canvas.getContext('2d');
    const legends = document.getElementById(obj.legendsId);
    const form = document.getElementById(obj.form);
    let loadStatus = true;
    let initialData = [];


    const donut = new Chart(chart, {
        type: 'doughnut',
        data: {
            labels: obj.labels,
            datasets: [{
                backgroundColor: obj.colorSet[0],
                data: [0, 0, 0, 0, 0, 0]
            }, {
                backgroundColor: obj.colorSet[1],
                data: [0, 0, 0, 0, 0, 0]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            stroke: false,
            aspectRatio: 1,
            cutoutPercentage: obj.cutoutPercentage,
            segmentShowStroke: false,
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            animation: {
                animateScale: true,
                animateRotate: true
            },
            elements: {
                arc: {
                    borderWidth: 0, // <-- Set this to zero
                    borderColor: '#333'
                }
            },
            events: ['mousemove'],
            hover: {mode: null},
            // onHover: (event) => {
            //     event.target.style.cursor = 'pointer';
            // }
        }
    });

    this.getKey = function () {
        return key;
    };

    this.isParent = function () {
        return form.classList.contains('parent-group-current');
    };

    this.setParent = function () {
        form.classList.add('parent-group-current');
        this.enableLegends();
    };

    this.unsetParent = function () {
        form.classList.remove('parent-group-current');
    };

    this.enableLegends = function (reset = false) {
        if (reset) {
            $(form).find("input[type='checkbox']").removeAttr("disabled");
        } else {
            $(form).find("input[type='checkbox']").not(".disabled").removeAttr("disabled");
        }
    };

    this.getCheckedLegends = function () {
        let checkedLegends = [];
        $(form).find("input[type='checkbox']:checked").each(function () {
            checkedLegends.push($(this).val());
        });

        return checkedLegends;
    };

    this.getCheckedLegendsSearchValue = function () {
        let checkedLegends = [];
        $(form).find("input[type='checkbox']:checked").each(function () {
            checkedLegends.push($(this).attr("data-searchvalue"));
        });

        return checkedLegends;
    };

    this.isLegendSelected = function () {
        return this.getCheckedLegends().length;
    };

    this.setLegends = function (key) {
        if (!loadStatus) {
            return;
        }

        initialData = key;

        // const labels = [];
        const fragment = document.createDocumentFragment();
        const outputlabels = document.createElement('ul');

        for (let i = 0; i < obj.labels.length; i++) {
            let object = key ? key.find(k => {
                return k.name.toLowerCase() === obj.labels[i].toLowerCase();
            }) : null;

            const listItem = document.createElement('li');
            const input = document.createElement('input');
            const label = document.createElement('label');
            labels.push(obj.labels[i]);
            if (object && object.checked) {
                listItem.classList.add('is-active');
                input.classList.add('is-active');
            }

            if (object && object.checked) {
                input.setAttribute('checked', '');
            }

            input.setAttribute('type', 'checkbox');
            input.classList.add('js-label-filter');
            input.classList.add('js-label-filter-' + i);

            if (!object) {
                object = {slug: labels[i].replace(/\s/gi, "-").toLowerCase(), disabled: true};
                input.disabled = true;
                input.classList.add('disabled');
            } else {
                label.classList.add('ga-select-filter');
            }


            if (object && object.slug) {
                input.setAttribute('name', inputName);
                input.setAttribute('value', object.slug);
                input.setAttribute('id', 'js-label-filter-' + object.slug);
                input.setAttribute('data-searchvalue', `.${object.slug}`);
                label.setAttribute('for', 'js-label-filter-' + object.slug);
            }

            label.textContent = labels[i];

            listItem.appendChild(input);
            listItem.appendChild(label);
            outputlabels.appendChild(listItem);
            input.addEventListener('change', function (e) {
                hasChanged = true;
                handleResponse(e);
            }, true);
            // checkboxes.push( input );
        }

        // Close labels markup.
        fragment.appendChild(outputlabels);

        // Output labels.
        legends.appendChild(fragment);
    };

    this.hasChanged = function () {
        const returnValue = hasChanged;
        hasChanged = false;
        return returnValue;
    };

    this.updateLegends = function (data) {
        $(form).find("input[type='checkbox']").each(function (index) {
            const slug = $(this).val();
            let obj = data.find(obj => obj.slug === slug);
            if (obj) {
                $(this).removeAttr("disabled");
                // $(this).removeClass('disabled');
                return;
            }

            $(this).attr("disabled", "");
            $(this).addClass('disabled');
        });
    };

    this.updateChart = function (data) {
        const keys = data.data.filters[key];
        var hasChecks = false;

        if (loadStatus || !phpData.payload.is_home) {
            labels = getlabelNames(data.data.filters[key]);
            initialData = data.data.filters[key];
        }
        
        //if (!labels.length) {
        labels = obj.labels;
        // }

        for (let i = 0; i < labels.length; i++) {
            const matchingStatus = keys ? keys.find(thisStatus => thisStatus.name.toLowerCase() === labels[i].toLowerCase()) : null;
            if (matchingStatus && matchingStatus.checked) {
                hasChecks = true;
                break;
            }
        }

        const responseData = [];

        // Loop them to get label name and count.
        for (let i = 0; i < labels.length; i++) {
            const matchingStatus = keys ? keys.find(thisStatus => thisStatus.name.toLowerCase() === labels[i].toLowerCase()) : null;
            // Add donut info all the time, not just checked. Or if initial load.
            if (((matchingStatus && !hasChecks) || (matchingStatus && matchingStatus.checked))) {
                responseData.push(matchingStatus.count);
            } else {
                // Must explicitly add 0 if unchecked to retain the same number of datasets.
                responseData.push(0);
            }
        }

        // Set data and labels.
        let isAllZero = responseData.every(item => item === 0);
        if(isAllZero){
            donut.data.datasets[0].data = [100];
            donut.data.datasets[1].data = [100];
            donut.data.datasets[0].backgroundColor = ['#ececec'];
            donut.data.datasets[1].backgroundColor = ['#ececec'];
            $('.no-data-text').removeClass('hidden');
            $('.pinkButtonStyle').addClass('empty-trial');
            $('.chartInfoInner').addClass('empty-info');

        }else{
            donut.data.datasets[0].data = responseData;
            donut.data.datasets[1].data = responseData;
            donut.data.datasets[0].backgroundColor = obj.colorSet[0];
            donut.data.datasets[1].backgroundColor = obj.colorSet[1];
            $('.no-data-text').addClass('hidden');
            $('.pinkButtonStyle').removeClass('empty-trial');
            $('.chartInfoInner').removeClass('empty-info');
        }
        donut.data.labels = labels;

        // Update chart.
        donut.update();
        
        loadStatus = false;
    };

    function getlabelNames(key) {
        const labels = [];

        for (let i = 0; i < key.length; i++) {
            labels.push(key[i].name);
        }

        return labels;
    }
}

module.exports = DonutChart;
