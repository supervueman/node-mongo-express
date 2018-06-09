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

  $('.add-post-btn, .save-post-btn').click(function(e){
    e.preventDefault();

    var isDraft = $(this).attr('class').split(' ')[1] === 'save-post-btn';
    var data = {
      title: $('#post-title').val(),
      description: $('#postbody').val(),
      isDraft: isDraft,
      postId: $('#post-id').val()
    };
    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/post/add'
    }).done(function(data){
      if (!data.ok) {
        console.log(data);
      } else {
        console.log(data);
        if (isDraft) {
          $(location).attr('href', '/post/edit/' + data.post.id);
        } else {
          $(location).attr('href', '/posts/' + data.post.url);
        }
      }
    });
  });

  var commentForm;
  var parentId;

  function form (isNew, comment) {
    $('.reply').show();
    if (commentForm) {
      commentForm.remove();
    }

    parentId = null;

    commentForm = $('.comment').clone(true, true);
    if (isNew) {
      commentForm.find('.cancel').hide();
      commentForm.appendTo('.comment-list');
    } else {
      var parentComment = $(comment).parent();
      parentId = parentComment.data('itemid');
      $(comment).after(commentForm);
    }
    commentForm.css({'display': 'flex'});
  }
  form(true);

  $('.reply').click(function(){
    form(false, this)
    $(this).hide();
  });

  $('.cancel').click(function(e){
    e.preventDefault();
    commentForm.remove();
    form(true);
  });

  $('.comment .send').click(function(e){
    e.preventDefault();
    var data = {
      post: $('.comments').data('postid'),
      body: commentForm.find('textarea').val(),
      parent: parentId
    };

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/comment/add'
    }).done(function(data){
      if (!data.ok) {
        if (data.error === undefined) {
          data.error = 'Unknown exeption'
          console.log(data.error);
        }
        console.log(data);
      } else {
        var newComment = '<ul><li><div class="author"><a href="/users/' + data.login + '">' + data.login + '</a><span class="date">' + data.createdAt + '</span></div>' + data.body + '</li></ul>';

        $(commentForm).after(newComment);
        form(true);
      }
    });
  });

  $('#fileinfo').submit(function(e){
    e.preventDefault();
    var formData = new FormData(this);
    console.log(formData);

    $.ajax({
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      url: '/upload/image',
      success: function(res){
        console.log(res);
      },
      error: function(err){
        console.log(err);
      }
    })
  });
});
/* eslint-enable */
