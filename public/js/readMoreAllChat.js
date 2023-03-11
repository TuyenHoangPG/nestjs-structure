$(document).ready(function () {
  $('#link-read-more-all-chat').bind('click', function () {
    let skipNumberPersonal = $('#all-chat').find('li:not(.group-chat)').length;
    let skipNumberGroup = $('#all-chat').find('li.group-chat').length;

    console.log('skipNumberPersonal', skipNumberPersonal);
    console.log('skipNumberGroup', skipNumberGroup);

    $(this).css('display', 'none');
    $('.read-more-all-chat-loading').css('display', 'inline-block');

    $.get(
      `/message/read-more-all-chat?skipNumberPersonal=${skipNumberPersonal}&skipNumberGroup=${skipNumberGroup}`,
      function (data) {
        if (data.leftSideHtmlString.trim() === '') {
          alertify.notify('Bạn không còn cuộc trò chuyện nào để xem nữa cả.', 'error', 7);
        } else {
          // Step 1: Handle leftSide.ejs
          $('#all-chat').find('ul').append(data.leftSideHtmlString);

          // Step 2: Handle scroll left
          resizeNiceScrollLeft(); // from mainConfig.js
          niceScrollLeft(); // from mainConfig.js

          // Step 3: Handle rightSide.ejs
          $('#screen-chat').find('ul').append(data.rightSideHtmlString);

          // Step 4: Call function changeScreenChat()
          changeScreenChat(); // from mainConfig.js

          // Step 5: Convert emoji
          convertEmojiToImg();

          // Step 6: Handle imageModal.ejs
          $('body').append(data.imageModalHtmlString);

          // Step 7: Call function gridPhotos()
          gridPhotos(5);

          // Step 8: Handle attachmentModal.ejs
          $('body').append(data.attachmentModalHtmlString);

          // Step 9: Update online
          socket.emit('check-status');
        }

        $('#link-read-more-all-chat').css('display', 'inline-block');
        $('.read-more-all-chat-loading').css('display', 'none');
      },
    );
  });
});
