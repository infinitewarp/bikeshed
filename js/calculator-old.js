function numify(input) {
    var output = Number((input).replace(/[^0-9\.]+/g,""));
    return isNaN(output) ? 0.0 : output;
}

function addContributor() {
    var number = $('.contributor').length + 1;
    var salary_id = 'salary_' + number;
    var checkbox_id = 'show_' + salary_id;
    $container = $('<div />')
        .prop('class', 'contributor');
    $name = $('<label />')
        .prop('for', salary_id)
        .text('Annual Gross Salary #' + number);
    $salary = $('<input type="password" placeholder="$&pound;&euro;" />')
        .prop('id', salary_id)
        .change(function() { calculate(); })
        .keyup(function() { calculate(); });
    $checkbox_label = $('<label />')
        .prop('for', checkbox_id)
        .text('reveal this amount');
    $checkbox = $('<input type="checkbox" />')
        .prop('id', checkbox_id)
        .change(function() {
            var input_name = '#' + $(this).prop('id').slice('show_'.length);
            var new_type = $(this).prop('checked') ? 'text' : 'password';
            $(input_name).get(0).type = new_type;
        });
    $container.append($name);
    $container.append($salary);
    $container.append($checkbox);
    $container.append($checkbox_label);

    $container.hide().appendTo($('#contributors')).show('fast');
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
    $("#minutes")
        .change(function() {
            calculate();
        })
        .keyup(function() {
            calculate();
        });
    // start with default two contributors
    addContributor();
    addContributor();
    // preload calculation once
    calculate();
});
