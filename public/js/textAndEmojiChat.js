function textAndEmojiChat(divId) {
  $('.emojionearea')
    .unbind('keyup')
    .on('keyup', function (element) {
      let $currentEmojioneArea = $(this);
      if (element.which === 13) {
        let targetId = $(`#write-chat-${divId}`).data('chat');
        let messageValue = $(`#write-chat-${divId}`).val();

        if (!targetId.length || !messageValue.length) {
          return;
        }

        let dataTextEmoji = {
          uid: targetId,
          messageValue,
        };

        if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
          dataTextEmoji.isChatGroup = true;
        }

        $.post('/message/add-new-message-text-emoji', dataTextEmoji, function (data) {
          let dataToEmit = {
            message: data.message,
          };

          // Step 1: Handle message data before showing
          let myMessage = $(`
          <div class="bubble me" data-mess-id="${data.message._id}">
          </div>
        `);
          myMessage.text(data.message.text);
          let convertMessageEmoji = emojione.toImage(myMessage.html());

          if (dataTextEmoji.isChatGroup) {
            let senderAvatar = `
            <img src="/images/users/${data.message.sender.avatar}" alt="avatar" class="avatar-small" title="${data.message.sender.name}">
          `;
            myMessage.html(`${senderAvatar} ${convertMessageEmoji}`);
            increaseNumberOfMessage(divId);
            dataToEmit.groupId = targetId;
          } else {
            myMessage.html(convertMessageEmoji);
            dataToEmit.contactId = targetId;
          }

          // Step 2: Append message to screen chat
          $(`.right .chat[data-chat=${divId}]`).append(myMessage);

          // Step 3: Re-config scroll
          niceScrollRight(divId);

          // Step 4: Remove data in input message
          $(`#write-chat-${divId}`).val('');
          $currentEmojioneArea.find('.emojionearea-editor').text('');

          // Step 5: Change data preview and timestamp in left side
          $(`.person[data-chat=${divId}]`)
            .find('span.time')
            .removeClass('message-time-sent')
            .html(moment(data.message.createdAt).locale('vi').startOf('seconds').fromNow());
          $(`.person[data-chat=${divId}]`).find('span.preview').html(emojione.toImage(data.message.text));

          // Step 6: Move conversation to top
          // Add namespace to event click - event namespace jquery
          $(`.person[data-chat=${divId}]`).on('newMessage.moveConversationToTop', function () {
            let dataToMove = $(this).parent();
            $(this).closest('ul').prepend(dataToMove);
            $(this).off('newMessage.moveConversationToTop');
          });
          $(`.person[data-chat=${divId}]`).trigger('newMessage.moveConversationToTop');

          // Step 7: Emit real-time
          socket.emit('chat-text-emoji', dataToEmit);
        }).fail(function (error) {
          alertify.notify(error.responseJSON[0], 'error', 7);
        });
      }
    });
}

$(document).ready(function () {
  socket.on('response-chat-text-emoji', function (response) {
    let divId = '';

    // Step 1: Handle message data before showing
    let yourMessage = $(`<div class="bubble you" data-mess-id="${response.message.id}"></div>`);
    yourMessage.text(response.message.text);
    let convertMessageEmoji = emojione.toImage(yourMessage.html());

    if (response.currentGroupId) {
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" alt="avatar" class="avatar-small" title="${response.message.sender.name}">`;
      yourMessage.html(`${senderAvatar} ${convertMessageEmoji}`);
      divId = response.currentGroupId;
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        increaseNumberOfMessage(divId);
      }
    } else {
      yourMessage.html(convertMessageEmoji);
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
    $(`.person[data-chat=${divId}]`).find('span.preview').html(emojione.toImage(response.message.text));

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
    typingOff(divId);

    // Step 9: If this has typing, remove that immediate
    let checkIsTyping = $(`.chat[data-chat=${divId}]`).find('div.bubble-typing-gif');
    if (checkIsTyping.length) {
      checkIsTyping.remove();
    }
  });
});
