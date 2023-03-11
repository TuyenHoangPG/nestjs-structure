$(document).ready(function () {
  $('#link-read-more-user-chat').bind('click', function () {
    let skipNumberPersonal = $('#user-chat').find('li.person').length;

    console.log('skipNumberPersonal', skipNumberPersonal);

    $(this).css('display', 'none');
    $('.read-more-user-chat-loading').css('display', 'inline-block');

    $.get(`/message/read-more-user-chat?skipNumberPersonal=${skipNumberPersonal}`, function (data) {
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

      $('#link-read-more-user-chat').css('display', 'inline-block');
      $('.read-more-user-chat-loading').css('display', 'none');
    });
  });
});
