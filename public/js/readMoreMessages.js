function readMoreMessages() {
  $('.right .chat')
    .unbind('scroll')
    .on('scroll', function () {
      // Get the first message
      let $firstMessage = $(this).find('.bubble:first');
      // Get position of first message
      let currentOffset = $firstMessage.offset().top - $(this).scrollTop();

      if ($(this).scrollTop() === 0) {
        let messageLoading = '<img src="images/chat/message-loading.gif" alt="" class="message-loading"/>';
        $(this).prepend(messageLoading);

        let targetId = $(this).data('chat');
        let skip = $(this).find('div.bubble').length;
        let isChatInGroup = $(this).hasClass('chat-in-group');
        let $thisScreenChat = $(this);

        $.get(
          `/message/read-more?skipMessage=${skip}&targetId=${targetId}&isChatInGroup=${isChatInGroup}`,
          function (data) {
            if (data.rightSideHtmlString.trim() === '') {
              alertify.notify('Bạn không còn cuộc trò chuyện nào để xem nữa cả.', 'error', 7);
            } else {
              // Step 1: Handle rightSide.ejs
              $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideHtmlString);

              // Step 2: Prevent scroll
              $(`.right .chat[data-chat=${targetId}]`).scrollTop($firstMessage.offset().top - currentOffset);

              // Step 3: Convert emoji
              convertEmojiToImg();

              // Step 4: Handle imageModal.ejs
              $(`#imagesModal_${targetId}`).find('div.all-images').prepend(data.imageModalHtmlString);

              // Step 5: Call function gridPhotos()
              gridPhotos(5);

              // Step 6: Handle attachmentModal.ejs
              $(`#attachmentsModal_${targetId}`).find('ul.list-attachments').prepend(data.attachmentModalHtmlString);
            }
            // Step 7: Remove message loading
            $thisScreenChat.find('img.message-loading').remove();
          },
        );
      }
    });
}

$(document).ready(function () {
  readMoreMessages();
});
