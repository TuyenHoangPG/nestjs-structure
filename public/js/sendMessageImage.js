function sendMessageImage(divId) {
  $(`#image-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      const fileData = $(this).prop('files')[0];
      const match = ['image/png', 'image/jpg', 'image/jpeg'];
      const limit = 1048576; // Byte = 1MB

      if ($.inArray(fileData.type, match) === -1) {
        alertify.notify('Kiểu file không hợp lệ, chỉ chấp nhận JPG hoặc PNG.', 'error', 7);
        $(this).val('');
        return false;
      }

      if (fileData.size > limit) {
        alertify.notify('Kích thước ảnh tối đa là 1MB.', 'error', 7);
        $(this).val('');
        return false;
      }

      const targetId = $(this).data('chat');
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append('my-image-chat', fileData);
      messageFormData.append('uid', targetId);

      if ($(this).hasClass('chat-in-group')) {
        messageFormData.append('isChatGroup', true);
        isChatGroup = true;
      }

      $.ajax({
        url: '/message/add-new-message-image',
        method: 'POST',
        cache: false,
        contentType: false,
        processData: false,
        data: messageFormData,
        success: function (data) {
          let dataToEmit = {
            message: data.message,
          };

          // Step 1: Handle message before show
          let myMessage = $(`
          <div class="bubble me bubble-image-file" data-mess-id="${data.message._id}">
          </div>
        `);
          let imageChat = `
          <img src="data: ${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data,
          )}" class="show-image-chat">
        `;

          if (isChatGroup) {
            let senderAvatar = `
            <img src="/images/users/${data.message.sender.avatar}" alt="avatar" class="avatar-small" title="${data.message.sender.name}">
          `;

            myMessage.html(`${senderAvatar} ${imageChat}`);
            increaseNumberOfMessage(divId);
            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(imageChat);
            dataToEmit.contactId = targetId;
          }

          // Step 2: Append message to screen chat
          $(`.right .chat[data-chat=${divId}]`).append(myMessage);

          // Step 3: Re-config scroll
          niceScrollRight(divId);

          // Step 4: Remove data in input message: Nothing to code !!!
          // Step 5: Change data preview and timestamp in left side
          $(`.person[data-chat=${divId}]`)
            .find('span.time')
            .removeClass('message-time-sent')
            .html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
          $(`.person[data-chat=${divId}]`).find('span.preview').html('Đã gửi cho bạn một hình ảnh');

          // Step 6: Move conversation to top
          // Add namespace to event click - event namespace jquery
          $(`.person[data-chat=${divId}]`).on('newMessage.moveConversationToTop', function () {
            let dataToMove = $(this).parent();
            $(this).closest('ul').prepend(dataToMove);
            $(this).off('newMessage.moveConversationToTop');
          });
          $(`.person[data-chat=${divId}]`).trigger('newMessage.moveConversationToTop');

          // Step 7: Emit real-time
          socket.emit('chat-image', dataToEmit);

          // Step 8: Add this image to modal image
          let imageModal = `<img src="data: ${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data,
          )}">`;
          $(`#imagesModal_${divId}`).find('div.all-images').append(imageModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on('response-chat-image', function (response) {
    let divId = '';

    // Step 1: Handle message data before showing
    let yourMessage = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message.id}"></div>`);
    let imageChat = `
      <img src="data: ${response.message.file.contentType}; base64, ${bufferToBase64(
      response.message.file.data.data,
    )}" class="show-image-chat">
    `;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" alt="avatar" class="avatar-small" title="${response.message.sender.name}">`;
      yourMessage.html(`${senderAvatar} ${imageChat}`);
      divId = response.currentGroupId;
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberOfMessage(divId);
      }
    } else {
      yourMessage.html(imageChat);
      divId = response.currentUserId;
    }

    // Step 2: Append message to screen chat
    // Step 3: Re-config scroll
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      $(`.right .chat[data-chat=${divId}]`).append(yourMessage);
      niceScrollRight(divId);

      $(`.person[data-chat=${divId}]`).find('span.time').addClass('message-time-sent');
    }

    // Step 4: Remove data in input message
    // Input has nothing to remove

    // Step 5: Change data preview and timestamp in left side
    $(`.person[data-chat=${divId}]`)
      .find('span.time')
      .html(moment(response.message.createdAt).locale('vi').startOf('seconds').fromNow());
    $(`.person[data-chat=${divId}]`).find('span.preview').html('Đã gửi cho bạn một hình ảnh');

    // Step 6: Move conversation to top
    // Add namespace to event click - event namespace jquery
    $(`.person[data-chat=${divId}]`).on('newMessage.moveConversationToTop', function () {
      let dataToMove = $(this).parent();
      $(this).closest('ul').prepend(dataToMove);
      $(this).off('newMessage.moveConversationToTop');
    });
    $(`.person[data-chat=${divId}]`).trigger('newMessage.moveConversationToTop');

    // Step 7: Emit real-time: Nothing to code !!!
    // Step 8: Emit remove typing real-time
    // Step 9: If this has typing, remove that immediate

    // Step 10: Add this image to modal image
    if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
      let imageModal = `<img src="data: ${response.message.file.contentType}; base64, ${bufferToBase64(
        response.message.file.data.data,
      )}">`;
      $(`#imagesModal_${divId}`).find('div.all-images').append(imageModal);
    }
  });
});
