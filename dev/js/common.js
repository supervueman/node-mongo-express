/* eslint-disable */
$(function(){
  var box_link = $('.box-link'),
      forms = $('.forms');

  box_link.click(function() {
    forms.removeClass('visible box-active');
    var id = $(this).attr('href');
    var ths_form = $(id);
    ths_form.addClass('visible');
    setTimeout(function(){
      ths_form.addClass('box-active');
    }, 50);
  });
});
/* eslint-enable */
