function sendMessageAttachment(divId) {
  $(`#attachment-chat-${divId}`)
    .unbind('change')
    .on('change', function () {
      const fileData = $(this).prop('files')[0];
      const limit = 1048576; // Byte = 1MB

      if (fileData.size > limit) {
        alertify.notify('Kích thước tệp tối đa là 1MB.', 'error', 7);
        $(this).val('');
        return false;
      }

      const targetId = $(this).data('chat');
      let isChatGroup = false;

      let messageFormData = new FormData();
      messageFormData.append('my-attachment-chat', fileData);
      messageFormData.append('uid', targetId);

      if ($(this).hasClass('chat-in-group')) {
        messageFormData.append('isChatGroup', true);
        isChatGroup = true;
      }

      $.ajax({
        url: '/message/add-new-message-attachment',
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
          <div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}">
          </div>
        `);

          let attachmentChat = `
          <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data,
          )}" download="${data.message.file.fileName}">
            ${data.message.file.fileName}
          </a>
        `;

          if (isChatGroup) {
            let senderAvatar = `
            <img src="/images/users/${data.message.sender.avatar}" alt="avatar" class="avatar-small" title="${data.message.sender.name}">
          `;

            myMessage.html(`${senderAvatar} ${attachmentChat}`);
            increaseNumberOfMessage(divId);
            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(attachmentChat);
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
          $(`.person[data-chat=${divId}]`).find('span.preview').html('Đã gửi cho bạn một tệp đính kèm');

          // Step 6: Move conversation to top
          // Add namespace to event click - event namespace jquery
          $(`.person[data-chat=${divId}]`).on('newMessage.moveConversationToTop', function () {
            let dataToMove = $(this).parent();
            $(this).closest('ul').prepend(dataToMove);
            $(this).off('newMessage.moveConversationToTop');
          });
          $(`.person[data-chat=${divId}]`).trigger('newMessage.moveConversationToTop');

          // Step 7: Emit real-time
          socket.emit('chat-attachment', dataToEmit);

          // Step 8: Add this attachment to modal attachment
          let attachmentModal = `
          <li>
            <a href="data: ${data.message.file.contentType}; base64, ${bufferToBase64(
            data.message.file.data.data,
          )}" download="${data.message.file.fileName}">
              ${data.message.file.fileName}
            </a>
          </li>
        `;
          $(`#attachmentsModal_${divId}`).find('ul.list-attachments').append(attachmentModal);
        },
        error: function (error) {
          alertify.notify(error.responseText, 'error', 7);
        },
      });
    });
}

$(document).ready(function () {
  socket.on('response-chat-attachment', function (response) {
    let divId = '';

    // Step 1: Handle message data before showing
    let yourMessage = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message.id}"></div>`);
    let attachmentChat = `
      <a href="data: ${response.message.file.contentType}; base64, ${bufferToBase64(
      response.message.file.data.data,
    )}" download="${response.message.file.fileName}">
        ${response.message.file.fileName}
      </a>
    `;

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" alt="avatar" class="avatar-small" title="${response.message.sender.name}">`;
      yourMessage.html(`${senderAvatar} ${attachmentChat}`);
      divId = response.currentGroupId;
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberOfMessage(divId);
      }
    } else {
      yourMessage.html(attachmentChat);
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
    $(`.person[data-chat=${divId}]`).find('span.preview').html('Đã gửi cho bạn một tệp đính kèm');

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
      let attachmentModal = `
        <li>
          <a href="data: ${response.message.file.contentType}; base64, ${bufferToBase64(
        response.message.file.data.data,
      )}" download="${response.message.file.fileName}">
            ${response.message.file.fileName}
          </a>
        </li>
      `;
      $(`#attachmentsModal_${divId}`).find('ul.list-attachments').append(attachmentModal);
    }
  });
});
