/* eslint-disable */
$(function(){
  var box_link = $('.box-link'),
      forms = $('.forms');

  box_link.click(function(e) {
    e.preventDefault();
    forms.removeClass('visible box-active');
    var id = $(this).attr('href');
    var ths_form = $(id);
    ths_form.addClass('visible');
    setTimeout(function(){
      ths_form.addClass('box-active');
    }, 50);
  });
});

// Registration
$('.reg-btn').click(function(e){
  e.preventDefault();
  var data = {
    login: $('#reg-login').val(),
    password: $('#reg-pass').val(),
    passwordConfirm: $('#reg-passconf').val()
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/auth/register'
  }).done(function(data){
    if (!data.ok) {
      $('.reg .h3').after('<p class="error">' + data.error + '</p>');
    } else {
      $(location).attr('href', '/');
      // $('.reg .h3').after('<p class="success">Success</p>');
    }
  });
});


// Authorization
$('.auth-btn').click(function(e){
  e.preventDefault();
  var data = {
    login: $('#auth-login').val(),
    password: $('#auth-pass').val()
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/auth/login'
  }).done(function(data){
    if (!data.ok) {
      $('.auth .h3').after('<p class="error">' + data.error + '</p>');
    } else {
      $(location).attr('href', '/');
    }
  });
});

$(function() {
  var elements = document.querySelectorAll('#postbody'),
      editor = new MediumEditor(elements);
});

$('.add-post-btn').click(function(e){
  e.preventDefault();
  var data = {
    title: $('#post-title').val(),
    description: $('#postbody').html()
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/post/add'
  }).done(function(data){
    if (!data.ok) {
      console.log('no ok');
    } else {
      console.log('ok');
      $(location).attr('href', '/');
    }
  });
});

$('.comment .send').click(function(e){
  e.preventDefault();
  var data = {
    body: $('#postbody').html()
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/post/add'
  }).done(function(data){
    if (!data.ok) {
      console.log('no ok');
    } else {
      console.log('ok');
      $(location).attr('href', '/');
    }
  });
});
/* eslint-enable */
