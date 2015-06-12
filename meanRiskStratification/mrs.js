

// keep track of the number of marker elements, to use the number as the id
var currentMarkers = $('#markers').children().length + 1;

$(document).ready(function () {
    $("#results, .bm_1, .bm_2, .bm_3").hide();
    controls_visibility(currentMarkers);
    bind_control_events();
    create_popover();

    $('.termToDefine, .dd.termToDefine').on('click', display_definition);
});

function bind_control_events() {
    // testing
    $('a#test1').on('click', test);
    $('a#test2').on('click', test);

    $('#reset').on('click', reset);
    $('#add-marker').on('click', new_marker);
    $('#delete-marker').on('click', delete_marker);
    $('#calculate').on('click', calculate);
}

function create_popover() {
    panel_actions();
    var term_element = $('.termToDefine');
    term_element.attr('data-toggle', 'popover');
    term_element.attr('role', 'button');
    term_element.attr('tabindex', '');
}

function panel_actions() {
    // make sure only one panel can open at a time in a group
    $('.panel-collapse').on('show.bs.collapse', function () {
        $('.panel-collapse').not(document.getElementById($(this).attr('id')))
            .removeClass('in')
            .addClass('collapse');
    });
}

function controls_visibility(numElements) {
    if (numElements == 2) {
        $('#delete-marker').show();
        $('#add-marker').show();
    }
    else if (numElements > 2) {
        $('#delete-marker').show();
        $('#add-marker').hide();
    }
    else {
        $('#delete-marker').hide();
        $('#add-marker').show();
    }
}

function new_marker() {
    var counter = currentMarkers + 1;
    if (currentMarkers < 3) {
        var markerTemplate = $('#markers').find('.marker').first();

        // clone controls
        var newElement = markerTemplate.clone();

        // increment included class
        newElement.removeClass('marker-1').addClass("marker-" + counter);

        // make sure previous values don't get copied also
        newElement.find('.input,input').each(function () {
            if ($(this).is("input")) {
                $(this).val("");
            }
            if ($(this).is("select")) {
                $(this)[0].selectedIndex = 0;
            }
        });

        // dynamically generate the id for the new panel elements
        newElement.find(".panel-title a").each(function (index) {
            $(this).attr('href', '#marker-' + counter + '-panel-' + (index + 1));
        });

        // generate new Ids for each on of the sub panels within the new generated marker
        newElement.find(".panel-collapse").each(function (index) {
            var newPanelContentId = 'marker-' + counter + '-panel-' + (index + 1);
            $(this).attr("id", newPanelContentId).addClass("collapse");
        });

        newElement.find('.marker-title').text("Biomarker #" + counter);
        newElement.find(".panel-toggle").each(function (index) {
            $(this).attr("href", "#marker-" + counter + "-panel-" + (index + 1));
        });

        newElement.find('.termToDefine, .dd.termToDefine').on('click', display_definition);

        // add new marker to #markers element
        $('#markers').append(newElement.fadeIn());
        currentMarkers++;

        panel_actions();
        controls_visibility(currentMarkers);
    }
}

function delete_marker() {
    if (currentMarkers > 1) {
        // remove last child
        $('#markers').children().last().remove();
    }
    currentMarkers--;
    controls_visibility(currentMarkers);
}

function display_definition() {
    // used to identify a specific element, since there will be multiple popover elements on the page
    var $self = $(this);
    var id;
    // treat drop down elements different than link/text elements
    if (!$self.hasClass('dd')) {
        if (!$self.hasClass('header') && $self.prop('tagName') != 'TD')
            id = ($self.attr('class')).replace('termToDefine', '').trim();
        if ($self.prop('tagName') == 'TD')
            id = ($self.attr('class')).replace('termToDefine', '').trim();
        else
            id = $self.attr('id');
    }
    else {
        // value selected in the drop down
        id = $self.prev().val();
    }

    var definition = definitionObj[id].definition;
    var term = definitionObj[id].term;

    if (definition || term) {
        $self.popover(
            {container: 'body', trigger: 'manual', placement: 'top', title: term, content: definition}
        ).on('mouseout', function () {
                $self.popover('hide');
                $self.popover('destroy');
            });

        $self.popover();
        $self.popover('show');
    }
}

function calculate() {
    var service;

    var valuesObj = extract_values(false);
    var invalid = valuesObj[1];
    if (!invalid) {
        var input = JSON.stringify(valuesObj[0]);

        var host = window.location.hostname;
        if (host == 'localhost') {
            // call json file instead of service
            service = 'output_example.json';
        } else {
            service = "http://" + host + "/mrsRest/";
        }

        // ajax call, change to actual service name
        var promise = $.ajax({
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            url: service,
            data: input
        });

        promise.then(clean_data, function (error) {
            console.log('Error: ' + JSON.stringify(error));
        });

        promise.done(return_data);
    }
    else {
        // show error message somewhere
        if (!$("#errors")[0]) {
            $('.title.text-center')
                .after($("<div><b class='text-danger'>Must enter values for either option 1 or 2 for the biomarkers</b></div>")
                    .attr('id', 'errors')
                    .addClass('well-sm'));
            setTimeout(function () {
                $('#errors').fadeOut().remove();
            }, 4000);
        }
    }
}

function clean_data(data) {
    return JSON.parse(JSON.stringify(data));
}

function return_data(data) {
    i = 0;
    do {
        i++;
        // propName should be bm_#
        $('.bm_' + i).show();
    } while (i != currentMarkers);

    $.each(data, function (propName, paramGroup) {
        append_name();

        params = paramGroup.parameters;
        calc = paramGroup.calculations;
        marker_id = propName;

        // loop through appending data to table
        $.each(params, function (name, obj) {
            var lookup_id = lookup[name];
            var data_item = params[name];

            // multiply all values by 100 to get percentage value
            var formattedText = (data_item["Value"] * 100) + "%";
            if (data_item["Confidence Interval (lower bound)"] != null &&
                data_item["Confidence Interval (upper bound)"] != null) {
                ci_lb = (data_item["Confidence Interval (lower bound)"] * 100);
                ci_ub = (data_item["Confidence Interval (upper bound)"] * 100);
                formattedText += " (" + ci_lb + "%, " + ci_ub + "%)";
            }

            // append text to table cell
            cell = $('#' + lookup_id + '_result.' + marker_id + '.output');
            cell.attr('title', lookup_id + " " + formattedText);
            cell.text(formattedText);
        });
        // same loop but through calculations
        $.each(calc, function (name, obj) {
            var lookup_id = lookup[name];
            var data_item = calc[name];

            var formattedText = data_item["Value"] + "%";
            if (data_item["Confidence Interval (lower bound)"] != null &&
                data_item["Confidence Interval (upper bound)"] != null) {
                formattedText += " (" + data_item["Confidence Interval (lower bound)"] + "%, "
                    + data_item["Confidence Interval (upper bound)"] + "%)";
            }

            cell = $('#' + lookup_id + '_result.' + marker_id + '.output');
            cell.attr('title', lookup_id + " " + formattedText);
            cell.text(formattedText);
        });
    });
    $("#results").show();
}

function append_name() {
    var i = 0;
    do {
        i++;
        var thisNameInputElement = $('.marker-' + i + ' .name-input');
        // append biomarker Name to results table header
        if ((thisNameInputElement.val()).length > 0)
            var name = thisNameInputElement.val();
        else
            name = "Biomarker " + i;

        // find the element to append the text to
        $('#results').find('table thead tr .bm_' + i).attr('title', name).text(name);
    } while (i != currentMarkers)
}

function extract_values(invalid) {
    var values = {};

    //append_name();
    // find biomarkers with values first, use currentMarkers for iteration
    i = 0;
    do {
        i++;

        values["bm_" + i] = {};
        var thisMarker = $('.marker-' + i);

        // inside this marker find inputs by group
        var option_1_controls = thisMarker.find('#marker-' + i + '-panel-1 .input').serializeArray(); // option 1
        var option_2_controls = thisMarker.find('#marker-' + i + '-panel-2 .input').serializeArray(); // option 2

        option_1_controls.forEach(function (element) {
            if (element.value.length > 0) {
                values["bm_" + i][element.name] = element.value;

                // set option value if there is none
                if (!values["bm_" + i].option) {
                    values["bm_" + i].option = 1;
                }
            }
        });

        // check option variable
        if (!values["bm_" + i].option) {

            // apply option flag
            values["bm_" + i].option = 2;

            var param_1 = [];
            var param_2 = [];
            var param_3 = [];
            var param_4 = [];

            option_2_controls.filter(function (obj) {
                // filter each pair into separate arrays

                if (obj.name == "param_1") {
                    param_1.push(obj);
                }
                if (obj.name == "param_2") {
                    param_2.push(obj);
                }
                if (obj.name == "param_3") {
                    param_3.push(obj);
                }
                if (obj.name == "sampsize") {
                    param_4.push(obj);
                }

            });
            var value_length = [param_1[1].value.length, param_2[1].value.length, param_3[1].value.length];
            value_length.forEach(function (el, ind, arr) {
                if (el > 0) {
                    invalid = false;
                    // manually mapping each value pair
                    values["bm_" + i][param_1[0].value] = param_1[1].value;
                    values["bm_" + i][param_2[0].value] = param_2[1].value;
                    values["bm_" + i][param_3[0].value] = param_3[1].value;
                }
                else {
                    invalid = true;
                }
            });
            // sample size
            values["bm_" + i][param_4[0].name] = param_4[0].value;
        }
    } while (i != currentMarkers);

    return [values, invalid];
}

function reset() {
    var currentMarkers = $('#markers').children().length;
    controls_visibility(currentMarkers);

    // remove generated markers
    $('#markers').children(':gt(0)').remove();

    // reset drop downs then, text boxes
    $('select').find('option:first').attr('selected', 'selected');
    $('input').val('');
    $("#results, .bm_1, .bm_2, .bm_3").hide();
    $('.output').text('');
}

function test() {
    var tbs = $('.marker-1');
    var values_option_1 = {"a": 471, "b": 13, "c": 4680, "d": 25207};
    var values_option_2 = {"ppv": 0.0914, "npv": (1 - 0.0005), "P(M+)": 0.1696, "total": 30371};

    if (this.id == "test1") {
        var tbs = $('.marker-1');

        // pull data from values_option_1
        tbs.find('#a').val(values_option_1['a']);
        tbs.find('#b').val(values_option_1['b']);
        tbs.find('#c').val(values_option_1['c']);
        tbs.find('#d').val(values_option_1['d']);
    }
    if (this.id == "test2") {

        // clear values for option 1
        tbs.find('#a').val("");
        tbs.find('#b').val("");
        tbs.find('#c').val("");
        tbs.find('#d').val("");

        // pull data from value_option_2
        tbs.find('.input[name="param_1"]')[0].selectedIndex = 0;//ppv
        tbs.find('.input[name="param_1"]')[1].value = values_option_2["ppv"];

        tbs.find('.input[name="param_2"]')[0].selectedIndex = 0;//npv
        tbs.find('.input[name="param_2"]')[1].value = values_option_2["npv"];

        tbs.find('.input[name="param_3"]')[0].selectedIndex = 0;//P(M+)
        tbs.find('.input[name="param_3"]')[1].value = values_option_2["P(M+)"];

        tbs.find('.input[name="sampsize"]')[0].value = values_option_2["total"];
    }
}
// definitions used for display
var definitionObj = {
    prob_m: {
        term: "Marker Positivity (M+)",
        definition: "Positive test result for biomarker"
    },
    m_neg: {
        term: "Marker Negativity (M-)",
        definition: "Negative test result for biomarker test"
    },
    prob_d: {
        term: "Disease Positive (D+)",
        definition: "Has disease"
    },
    d_neg: {
        term: "Disease Negative (D-)",
        definition: "Does not have disease"
    },
    danger: {
        term: "Danger",
        definition: "Increase in disease risk from testing positive"
    },
    reassurance: {
        term: "Reassurance",
        definition: "Reduction in disease risk from testing negative"
    },
    pbs: {
        term: "Population Burden Stratification",
        definition: "Extra disease detection in positive group than negative group"
    },
    nns: {
        term: "Number Needed to Screen",
        definition: "Definition for number needed to screen"
    },
    nnr: {
        term: "Number Needed to Recruit",
        definition: "To detect 1 more disease case in positive group than negative group"
    },
    max_mrs: {
        term: "Maximum possible MRS for a disease with this prevalence",
        definition: "Maximum possible MRS for a disease with this prevalence"
    },
    q_spec: {
        term: "Quality of the specificity",
        definition: "Increase in specificity versus a random test, fixing test positivity"
    },
    q_sens: {
        term: "Quality of the sensitivity",
        definition: "Increase in sensitivity versus a random test, fixing test positivity"
    },
    spec: {
        term: "Specificity",
        definition: "Specificity is the proportion whose biomarker test is negative (below the threshold) among" +
        " those without disease."
    },
    sens: {
        term: "Sensitivity",
        definition: "Sensitivity is the proportion whose biomarker test is positive (above the threshold) among " +
        "those who are positive for disease."
    },
    ppv: {
        term: "Positive Predictive Value (PPV)",
        definition: "Probability of disease, given a positive test result from biomarker.  Unlike sensitivity " +
        "and specificity, PPV's reflect disease prevalence and is useful for risk stratification."
    },
    npv: {
        term: "Negative Predictive Value (NPV)",
        definition: "Definition for NPV"
    },
    mrs:{
        term: "Mean Risk Stratification (MRS)",
        definition: "Average change in pretest-posttest disease risk"
    },
    sampsize:{term:"Sample Size",definition:""}
};
var lookup = {
    "Danger": "danger",
    "Reassurance": "reassurance",
    "Quality of the sensitvity": "q_sens",
    "Quality of the specificity": "q_spec",
    "Mean Risk Stratification": "mrs",
    "Maximum possible MRS": "max_mrs",
    "Population Burden Stratification": "pbs",
    "Number Needed to Recruit": "nnr",
    "Number Needed to Screen": "nns",
    "a": "a",
    "b": "b",
    "c": "c",
    "d": "d",
    "P(D+,M+)": "d_pos",
    "P(D+,M-)": "pos_d_neg_m",
    "P(D-,M+)": "neg_d_pos_m",
    "P(D-,M-)": "m_neg",
    "Marker Positivity": "prob_m",
    "Disease Prevalence": "prob_d",
    "Positive Predictive Value": "ppv",
    "complement of the Negative Predictive Value": "c_npv",
    "Sensitivity": "sens",
    "Specificity": "spec",
    "complement of the Specificity": "c_spec",
    "RR": "rr",
    "Risk Difference": "r_diff",
    "Youden": "youden",
    "Area Under the Curve": "auc",
    "Confidence Interval (lower bound)": "ci_lb",
    "Confidence Interval (upper bound)": "ci_ub",
    "Value":"value"
};