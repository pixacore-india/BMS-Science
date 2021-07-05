const { URL, URLSearchParams } = require('@lvchengbin/url');

let UTILITY = {
    getCookie: function(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    conferenceView: function(){
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const conferenceView = urlParams.get('conference-view');
        return conferenceView == 'true';
    },
    isHome: function() {
        return $('body').hasClass("home");
    },
    isSearchResults: function() {
        return $('body').hasClass("search-results") || this.dom.body.hasClass("search-no-results");
    },
    isSaveTrialTemplate: function(){
        return $('body').hasClass("page-template-page-saved-clinical-trials");
    },
    isSingleTrial: function() {
        return $('body').hasClass("single-trial");
    },
    isDiseaseArea: function() {
        return $('body').hasClass("single-disease-area");
    },
    isSpecialty: function() {
        return $('body').hasClass("tax-specialty");
    },
    isDashBoard: function() {
        return $('body').hasClass("page-template-page-dashboard");
    },
    isCelgeneDashBoard: function() {
        return $('body').hasClass("page-template-celgene-dashboard");
    },
    isPatientSearch: function() {
        return $('body').hasClass("page-template-page-search-patient-type");
    },
    isAdvancedSearch: function() {
        return $('body').hasClass("advanced-search");
    },

    getQueryString: function (url, key) {
        if (!url) url = window.location.href;
        key = key.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    updateQueryString: function (uri, key, value) {
        const re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
        let newUri = uri;
        if (uri.match(re)) {
            newUri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            let hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            const separator = uri.indexOf('?') !== -1 ? "&" : "?";
            newUri = uri + separator + key + "=" + value;
        }
        if (key === 'posts_per_page') {
            return newUri;
        }
        history.pushState({}, null, newUri);
    },


    getParamsByPrefix: function (prefix) {
        let url = new URL(window.location.href);
        let params = {};

        for (let i = 0; i < url.searchParams.dict.length; i++) {
            let key = url.searchParams.dict[i].shift();
            let value = url.searchParams.dict[i].shift();

            for (let j = 0; j < prefix.length; j++) {
                let givenKey = prefix[j];
                if (key.startsWith(givenKey)) {
                    params[key] = value;
                }
            }
        }

        return params;
    },

    getParams: function (uKey) {
        let url = new URL(window.location.href);

        for (let i = 0; i < url.searchParams.dict.length; i++) {
            let key = url.searchParams.dict[i].shift();
            let value = url.searchParams.dict[i].shift();

            if(uKey == key){
                return value;
            }
        }
        return 0;
    },

    setCookie: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    setCookieInHours: function(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    polyfill: function() { //polyfill for array find for IE
        if (!Array.prototype.find) {
            Object.defineProperty(Array.prototype, 'find', {
                value: function (predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return kValue.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return undefined.
                    return undefined;
                },
                configurable: true,
                writable: true
            });
        }
    },






    //static json data - to be replaced later
    countryOptions: [
        {
            "val": "current-locations",
            "value": "Current Location"
        },{
            "val": "united-states",
            "value": "United States"
        }, {
            "val": "afghanistan",
            "value": "Afghanistan"
        }, {
            "val": "albania",
            "value": "Albania"
        }, {
            "val": "algeria",
            "value": "Algeria"
        }, {
            "val": "american-samoa",
            "value": "American Samoa"
        }, {
            "val": "andorra",
            "value": "Andorra"
        }, {
            "val": "angola",
            "value": "Angola"
        }, {
            "val": "antarctica",
            "value": "Antarctica"
        }, {
            "val": "argentina",
            "value": "Argentina"
        }, {
            "val": "armenia",
            "value": "Armenia"
        }, {
            "val": "aruba",
            "value": "Aruba"
        }, {
            "val": "australia",
            "value": "Australia"
        }, {
            "val": "austria",
            "value": "Austria"
        }, {
            "val": "azerbaijan",
            "value": "Azerbaijan"
        }, {
            "val": "bahamas",
            "value": "Bahamas"
        }, {
            "val": "bahrain",
            "value": "Bahrain"
        }, {
            "val": "bangladesh",
            "value": "Bangladesh"
        }, {
            "val": "barbados",
            "value": "Barbados"
        }, {
            "val": "belarus",
            "value": "Belarus"
        }, {
            "val": "belgium",
            "value": "Belgium"
        }, {
            "val": "belize",
            "value": "Belize"
        }, {
            "val": "benin",
            "value": "Benin"
        }, {
            "val": "bermuda",
            "value": "Bermuda"
        }, {
            "val": "bhutan",
            "value": "Bhutan"
        }, {
            "val": "bolivia",
            "value": "Bolivia"
        }, {
            "val": "bosnia-and-herzegovina",
            "value": "Bosnia and herzegovina"
        }, {
            "val": "botswana",
            "value": "Botswana"
        }, {
            "val": "brazil",
            "value": "Brazil"
        }, {
            "val": "brunei-darussalam",
            "value": "Brunei Darussalam"
        }, {
            "val": "bulgaria",
            "value": "Bulgaria"
        }, {
            "val": "burkina-faso",
            "value": "Burkina faso"
        }, {
            "val": "burundi",
            "value": "Burundi"
        }, {
            "val": "cote-divoire",
            "value": "CÃ´te D'Ivoire"
        }, {
            "val": "cambodia",
            "value": "Cambodia"
        }, {
            "val": "cameroon",
            "value": "Cameroon"
        }, {
            "val": "canada",
            "value": "Canada"
        }, {
            "val": "cayman-islands",
            "value": "Cayman islands"
        }, {
            "val": "central-african-republic",
            "value": "Central african republic"
        }, {
            "val": "chad",
            "value": "Chad"
        }, {
            "val": "chile",
            "value": "Chile"
        }, {
            "val": "china",
            "value": "China"
        }, {
            "val": "colombia",
            "value": "Colombia"
        }, {
            "val": "comoros",
            "value": "Comoros"
        }, {
            "val": "congo",
            "value": "Congo"
        }, {
            "val": "congo-the-democratic-republic-of-the",
            "value": "Congo, the democratic republic of the"
        }, {
            "val": "costa-rica",
            "value": "Costa rica"
        }, {
            "val": "croatia",
            "value": "Croatia"
        }, {
            "val": "cuba",
            "value": "Cuba"
        }, {
            "val": "cyprus",
            "value": "Cyprus"
        }, {
            "val": "czech-republic",
            "value": "Czech republic"
        }, {
            "val": "czechia",
            "value": "czechia"
        }, {
            "val": "denmark",
            "value": "Denmark"
        }, {
            "val": "djibouti",
            "value": "Djibouti"
        }, {
            "val": "dominican-republic",
            "value": "Dominican republic"
        }, {
            "val": "ecuador",
            "value": "Ecuador"
        }, {
            "val": "egypt",
            "value": "Egypt"
        }, {
            "val": "el-salvador",
            "value": "El salvador"
        }, {
            "val": "equatorial-guinea",
            "value": "Equatorial guinea"
        }, {
            "val": "estonia",
            "value": "Estonia"
        }, {
            "val": "ethiopia",
            "value": "Ethiopia"
        }, {
            "val": "faroe-islands",
            "value": "Faroe islands"
        }, {
            "val": "federated-states-of-micronesia",
            "value": "Federated States of Micronesia"
        }, {
            "val": "fiji",
            "value": "Fiji"
        }, {
            "val": "finland",
            "value": "Finland"
        }, {
            "val": "former-serbia-and-montenegro",
            "value": "Former serbia and montenegro"
        }, {
            "val": "former-yugoslavia",
            "value": "Former yugoslavia"
        }, {
            "val": "france",
            "value": "France"
        }, {
            "val": "french-guiana",
            "value": "French guiana"
        }, {
            "val": "french-polynesia",
            "value": "French polynesia"
        }, {
            "val": "gabon",
            "value": "Gabon"
        }, {
            "val": "gambia",
            "value": "Gambia"
        }, {
            "val": "georgia",
            "value": "Georgia"
        }, {
            "val": "germany",
            "value": "Germany"
        }, {
            "val": "ghana",
            "value": "Ghana"
        }, {
            "val": "gibraltar",
            "value": "Gibraltar"
        }, {
            "val": "greece",
            "value": "Greece"
        }, {
            "val": "greenland",
            "value": "Greenland"
        }, {
            "val": "grenada",
            "value": "Grenada"
        }, {
            "val": "guadeloupe",
            "value": "Guadeloupe"
        }, {
            "val": "guam",
            "value": "Guam"
        }, {
            "val": "guatemala",
            "value": "Guatemala"
        }, {
            "val": "guinea",
            "value": "Guinea"
        }, {
            "val": "guinea-bissau",
            "value": "Guinea-Bissau"
        }, {
            "val": "guyana",
            "value": "Guyana"
        }, {
            "val": "haiti",
            "value": "Haiti"
        }, {
            "val": "holy-see-vatican-city-state",
            "value": "Holy see (vatican city state)"
        }, {
            "val": "honduras",
            "value": "Honduras"
        }, {
            "val": "hong-kong",
            "value": "Hong kong"
        }, {
            "val": "hungary",
            "value": "Hungary"
        }, {
            "val": "iceland",
            "value": "Iceland"
        }, {
            "val": "india",
            "value": "India"
        }, {
            "val": "indonesia",
            "value": "Indonesia"
        }, {
            "val": "iran-islamic-republic-of",
            "value": "Iran, islamic iepublic of"
        }, {
            "val": "iraq",
            "value": "Iraq"
        }, {
            "val": "ireland",
            "value": "Ireland"
        }, {
            "val": "israel",
            "value": "Israel"
        }, {
            "val": "italy",
            "value": "Italy"
        }, {
            "val": "jamaica",
            "value": "Jamaica"
        }, {
            "val": "japan",
            "value": "Japan"
        }, {
            "val": "jersey",
            "value": "Jersey"
        }, {
            "val": "jordan",
            "value": "Jordan"
        }, {
            "val": "kazakhstan",
            "value": "Kazakhstan"
        }, {
            "val": "kenya",
            "value": "Kenya"
        }, {
            "val": "korea-democratic-peoples-republic-of",
            "value": "Korea, democratic people's pepublic of"
        }, {
            "val": "korea-republic-of",
            "value": "Korea, republic of"
        }, {
            "val": "kosovo",
            "value": "Kosovo"
        }, {
            "val": "kuwait",
            "value": "Kuwait"
        }, {
            "val": "kyrgyzstan",
            "value": "Kyrgyzstan"
        }, {
            "val": "lao-peoples-democratic-republic",
            "value": "Lao people's democratic republic"
        }, {
            "val": "latvia",
            "value": "Latvia"
        }, {
            "val": "lebanon",
            "value": "Lebanon"
        }, {
            "val": "lesotho",
            "value": "Lesotho"
        }, {
            "val": "liberia",
            "value": "Liberia"
        }, {
            "val": "libyan-arab-jamahiriya",
            "value": "Libyan arab jamahiriya"
        }, {
            "val": "liechtenstein",
            "value": "Liechtenstein"
        }, {
            "val": "lithuania",
            "value": "Lithuania"
        }, {
            "val": "luxembourg",
            "value": "Luxembourg"
        }, {
            "val": "macedonia-the-former-yugoslav-republic-of",
            "value": "Macedonia, the former yugoslav republic of"
        }, {
            "val": "madagascar",
            "value": "Madagascar"
        }, {
            "val": "malawi",
            "value": "Malawi"
        }, {
            "val": "malaysia",
            "value": "Malaysia"
        }, {
            "val": "maldives",
            "value": "Maldives"
        }, {
            "val": "mali",
            "value": "Mali"
        }, {
            "val": "malta",
            "value": "Malta"
        }, {
            "val": "martinique",
            "value": "Martinique"
        }, {
            "val": "mauritania",
            "value": "Mauritania"
        }, {
            "val": "mauritius",
            "value": "Mauritius"
        }, {
            "val": "mayotte",
            "value": "Mayotte"
        }, {
            "val": "mexico",
            "value": "Mexico"
        }, {
            "val": "moldova-republic-of",
            "value": "Moldova, republic of"
        }, {
            "val": "monaco",
            "value": "Monaco"
        }, {
            "val": "mongolia",
            "value": "Mongolia"
        }, {
            "val": "montenegro",
            "value": "Montenegro"
        }, {
            "val": "montserrat",
            "value": "Montserrat"
        }, {
            "val": "morocco",
            "value": "Morocco"
        }, {
            "val": "mozambique",
            "value": "Mozambique"
        }, {
            "val": "myanmar",
            "value": "Myanmar"
        }, {
            "val": "namibia",
            "value": "Namibia"
        }, {
            "val": "nepal",
            "value": "Nepal"
        }, {
            "val": "netherlands",
            "value": "Netherlands"
        }, {
            "val": "netherlands-antilles",
            "value": "Netherlands antilles"
        }, {
            "val": "new-caledonia",
            "value": "New Caledonia"
        }, {
            "val": "new-zealand",
            "value": "New Zealand"
        }, {
            "val": "nicaragua",
            "value": "Nicaragua"
        }, {
            "val": "niger",
            "value": "Niger"
        }, {
            "val": "nigeria",
            "value": "Nigeria"
        }, {
            "val": "northern-mariana-islands",
            "value": "Northern mariana islands"
        }, {
            "val": "norway",
            "value": "Norway"
        }, {
            "val": "oman",
            "value": "Oman"
        }, {
            "val": "pakistan",
            "value": "Pakistan"
        }, {
            "val": "palau",
            "value": "Palau"
        }, {
            "val": "palestinian-territories-occupied",
            "value": "Palestinian Territories, Occupied"
        }, {
            "val": "palestinian-territory-occupied",
            "value": "Palestinian Territory, occupied"
        }, {
            "val": "panama",
            "value": "Panama"
        }, {
            "val": "papua-new-guinea",
            "value": "Papua new guinea"
        }, {
            "val": "paraguay",
            "value": "Paraguay"
        }, {
            "val": "peru",
            "value": "Peru"
        }, {
            "val": "philippines",
            "value": "Philippines"
        }, {
            "val": "poland",
            "value": "Poland"
        }, {
            "val": "portugal",
            "value": "Portugal"
        }, {
            "val": "puerto-rico",
            "value": "Puerto rico"
        }, {
            "val": "qatar",
            "value": "Qatar"
        }, {
            "val": "reunion",
            "value": "Reunion"
        }, {
            "val": "romania",
            "value": "Romania"
        }, {
            "val": "russian-federation",
            "value": "Russian federation"
        }, {
            "val": "rwanda",
            "value": "Rwanda"
        }, {
            "val": "saint-kitts-and-nevis",
            "value": "Saint kitts and nevis"
        }, {
            "val": "saint-lucia",
            "value": "Saint lucia"
        }, {
            "val": "saudi-arabia",
            "value": "Saudi arabia"
        }, {
            "val": "senegal",
            "value": "Senegal"
        }, {
            "val": "serbia",
            "value": "Serbia"
        }, {
            "val": "seychelles",
            "value": "Seychelles"
        }, {
            "val": "sierra-leone",
            "value": "Sierra leone"
        }, {
            "val": "singapore",
            "value": "Singapore"
        }, {
            "val": "slovakia",
            "value": "Slovakia"
        }, {
            "val": "slovenia",
            "value": "Slovenia"
        }, {
            "val": "solomon-islands",
            "value": "Solomon islands"
        }, {
            "val": "somalia",
            "value": "Somalia"
        }, {
            "val": "south-africa",
            "value": "South africa"
        }, {
            "val": "spain",
            "value": "Spain"
        }, {
            "val": "sri-lanka",
            "value": "Sri lanka"
        }, {
            "val": "sudan",
            "value": "Sudan"
        }, {
            "val": "suriname",
            "value": "Suriname"
        }, {
            "val": "swaziland",
            "value": "Swaziland"
        }, {
            "val": "sweden",
            "value": "Sweden"
        }, {
            "val": "switzerland",
            "value": "Switzerland"
        }, {
            "val": "syrian-arab-republic",
            "value": "Syrian arab republic"
        }, {
            "val": "taiwan",
            "value": "Taiwan"
        }, {
            "val": "tajikistan",
            "value": "Tajikistan"
        }, {
            "val": "tanzania",
            "value": "Tanzania"
        }, {
            "val": "thailand",
            "value": "Thailand"
        }, {
            "val": "togo",
            "value": "Togo"
        }, {
            "val": "trinidad-and-tobago",
            "value": "Trinidad and tobago"
        }, {
            "val": "tunisia",
            "value": "Tunisia"
        }, {
            "val": "turkey",
            "value": "Turkey"
        }, {
            "val": "uganda",
            "value": "Uganda"
        }, {
            "val": "ukraine",
            "value": "Ukraine"
        }, {
            "val": "united-arab-emirates",
            "value": "United arab emirates"
        }, {
            "val": "united-kingdom",
            "value": "United kingdom"
        }, {
            "val": "uruguay",
            "value": "Uruguay"
        }, {
            "val": "uzbekistan",
            "value": "Uzbekistan"
        }, {
            "val": "vanuatu",
            "value": "Vanuatu"
        }, {
            "val": "venezuela",
            "value": "Venezuela"
        }, {
            "val": "vietnam",
            "value": "Vietnam"
        }, {
            "val": "virgin-islands-u-s",
            "value": "Virgin islands (U.S.)"
        }, {
            "val": "yemen",
            "value": "Yemen"
        }, {
            "val": "zambia",
            "value": "Zambia"
        }, {
            "val": "zimbabwe",
            "value": "Zimbabwe"
        }],

    stateOptions: [
        { val: 'alabama', 'value': 'Alabama' },
        { val: 'alaska', 'value': 'Alaska' },
        { val: 'arizona', 'value': 'Arizona' },
        { val: 'arkansas', 'value': 'Arkansas' },
        { val: 'california', 'value': 'California' },
        { val: 'colorado', 'value': 'Colorado' },
        { val: 'connecticut', 'value': 'Connecticut' },
        { val: 'delaware', 'value': 'Delaware' },
        { val: 'district-of-columbia', 'value': 'District of Columbia' },
        { val: 'florida', 'value': 'Florida' },
        { val: 'georgia', 'value': 'Georgia' },
        { val: 'hawaii', 'value': 'Hawaii' },
        { val: 'idaho', 'value': 'Idaho' },
        { val: 'illinois', 'value': 'Illinois' },
        { val: 'indiana', 'value': 'Indiana' },
        { val: 'iowa', 'value': 'Iowa' },
        { val: 'kansas', 'value': 'Kansas' },
        { val: 'kentucky', 'value': 'Kentucky' },
        { val: 'louisiana', 'value': 'Louisiana' },
        { val: 'maine', 'value': 'Maine' },
        { val: 'maryland', 'value': 'Maryland' },
        { val: 'massachusetts', 'value': 'Massachusetts' },
        { val: 'michigan', 'value': 'Michigan' },
        { val: 'minnesota', 'value': 'Minnesota' },
        { val: 'mississippi', 'value': 'Mississippi' },
        { val: 'missouri', 'value': 'Missouri' },
        { val: 'montana', 'value': 'Montana' },
        { val: 'nebraska', 'value': 'Nebraska' },
        { val: 'nevada', 'value': 'Nevada' },
        { val: 'new-hampshire', 'value': 'New Hampshire' },
        { val: 'new-jersey', 'value': 'New Jersey' },
        { val: 'new-mexico', 'value': 'New Mexico' },
        { val: 'new-york', 'value': 'New York' },
        { val: 'north-carolina', 'value': 'North Carolina' },
        { val: 'north-dakota', 'value': 'North Dakota' },
        { val: 'ohio', 'value': 'Ohio' },
        { val: 'oklahoma', 'value': 'Oklahoma' },
        { val: 'oregon', 'value': 'Oregon' },
        { val: 'pennsylvania', 'value': 'Pennsylvania' },
        { val: 'rhode-island', 'value': 'Rhode Island' },
        { val: 'south-carolina', 'value': 'South Carolina' },
        { val: 'south-dakota', 'value': 'South Dakota' },
        { val: 'tennessee', 'value': 'Tennessee' },
        { val: 'texas', 'value': 'Texas' },
        { val: 'utah', 'value': 'Utah' },
        { val: 'vermont', 'value': 'Vermont' },
        { val: 'virginia', 'value': 'Virginia' },
        { val: 'washington', 'value': 'Washington' },
        { val: 'west-virginia', 'value': 'West Virginia' },
        { val: 'wisconsin', 'value': 'Wisconsin' },
        { val: 'wyoming', 'value': 'Wyoming' }
    ],





    advanceTooltip: [{
        "val": "accepts-healthy-volunteers",
        "text": "Healthy volunteers may participate in the study"
    }, { "val": "birth-to-17-years", "text": "Child (birth-17 years)" }, {
        "val": "18-to-64-years",
        "text": " Adult (18-64 years)"
    }, { "val": "64-years", "text": " Older adult (65+ years)" }, { "val": "yes", "text": "Available" }, {
        "val": "no",
        "text": " No longer available"
    }, { "val": "temporarily", "text": " Temporarily not available" }, {
        "val": "approved",
        "text": " Approved for marketing"
    }, { "val": "nih", "text": "NIH" }, { "val": "u-s-fed", "text": "Other U.S. federal agency" }, {
        "val": "industry",
        "text": "Industry"
    }, { "val": "other", "text": "All others (individuals, universities, organizations)" }, {
        "val": "early-phase-1",
        "text": "Early phase 1"
    }, { "val": "phase-1", "text": "Phase 1" }, { "val": "phase-2", "text": "Phase 2" }, {
        "val": "phase-3",
        "text": "Phase 3"
    }, { "val": "phase-4", "text": "Phase 4" }, { "val": "n-a", "text": "Not applicable" }, {
        "val": "all",
        "text": "All"
    }, { "val": "female", "text": " Studies with female participants" }, {
        "val": "male",
        "text": " Studies with male participants"
    }, { "val": "not-yet-recruiting", "text": "Not yet recruiting" }, {
        "val": "recruiting",
        "text": " Recruiting"
    }, { "val": "enrolling-by-invitation", "text": "Enrolling by invitation" }, {
        "val": "active-not-recruiting",
        "text": " Active, not recruiting"
    }, { "val": "other", "text": " Other" }, { "val": "suspended", "text": " Suspended " }, {
        "val": "terminated",
        "text": " Terminated"
    }, { "val": "completed", "text": " Completed" }, { "val": "withdrawn", "text": " Withdrawn" }, {
        "val": "unknown-status",
        "text": " Unknown status"
    }, { "val": "protocol", "text": "Study protocols" }, {
        "val": "sap",
        "text": "Statistical analysis plans (SAPs)"
    }, { "val": "icf", "text": "Informed consent forms (ICFs)" }, { "val": "", "text": " All studies" }, {
        "val": "yes",
        "text": " Studies with results"
    }, { "val": "no", "text": " Studies without results" }, { "val": "all", "text": " All studies" }, {
        "val": "interventional",
        "text": " Interventional studies"
    }, { "val": "observational", "text": " Observational studies" }, {
        "val": "observational-patient-registry",
        "text": " Patient registries"
    }, { "val": "expanded-access", "text": " Expanded access studies" }, {
        "val": "individual-patients",
        "text": " Individual patients"
    }, { "val": "intermediate-size-population", "text": " Intermediate-size population" }, {
        "val": "treatment-protocol",
        "text": " Treatment IND/protocol"
    }]
};

module.exports = UTILITY;
