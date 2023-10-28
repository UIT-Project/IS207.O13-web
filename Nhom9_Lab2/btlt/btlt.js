$(document).ready(function () {
	$('.display_calculate').attr('disabled', 'true');
	$('.display_result').attr('disabled', 'true');
});

$('button.num').on('click', function () {
	$input = $(this).html(); 
	$value_caculate = $('.display_calculate').val();
	$('.display_calculate').val($value_caculate + $input);
	$('button.operator').removeAttr('disabled');
	$('button.equal').removeAttr('disabled');
});

$('button.dot').on('click', function () {
	$input = $(this).html();
	$value_caculate = $('.display_calculate').val();
	$('.display_calculate').val($value_caculate + $input);
	$('button.operator').attr('disabled', 'true');
	$(this).attr('disabled', 'true');
});

$('button.operator').on('click', function () {
	$input = $(this).html();
	$value_caculate = $('.display_calculate').val();
	$('.display_calculate').val($value_caculate + $input);
	$('button.operator').attr('disabled', 'true');
	$('button.dot').removeAttr('disabled');
});

$('button.del').on('click', function () {
	$value_caculate = $('.display_calculate').val();
	$('.display_calculate').val($value_caculate.slice(0,-1));
	$('button.operator').removeAttr('disabled');
});

$('button.ce').on('click', function () {
	$('.display_calculate').val('');
	$('.display_result').val('');
	$('button.dot').removeAttr('disabled');
});

$('button.equal').on('click', function () {
	$value_caculate = $('.display_calculate').val();
	$('.display_result').val(strip(eval($value_caculate)));
});

function strip(number) {
    return (parseFloat(number.toPrecision(10)));
}