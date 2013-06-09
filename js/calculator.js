function setupCheckboxesOnChange() {
    $("input[type='checkbox'][id^='show_salary_']").change( function() {
        var input_name = '#' + $(this).prop('id').slice('show_'.length);
        var new_type = $(this).prop('checked') ? 'text' : 'password';
        $(input_name).get(0).type = new_type;
    });
}

function setupInputsOnChange() {
    $("input[id^='salary_'], input[id='minutes']").change( function() {
        calculate();
    });
    $("input[id^='salary_'], input[id='minutes']").keyup( function() {
        calculate();
    });
}

function numify(input) {
    var output = Number((input).replace(/[^0-9\.]+/g,""));
    return isNaN(output) ? 0.0 : output;
}

function calculate() {
    var total_annual = Number(0.0);
    $("input[id^=salary_]").each(function() {
        total_annual += numify($(this).val());
    });
    var minutely = total_annual / 50.0 / 40.0 / 60.0;
    var minutes = numify($("input[id='minutes']").val());
    var cost = (minutes * minutely).toFixed(2);
    $("span[id='cost']").text(cost);
    return cost;
}

$(document).ready(function() {
    setupCheckboxesOnChange();
    setupInputsOnChange();
    calculate();
});