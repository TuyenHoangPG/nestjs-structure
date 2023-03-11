function typingOn(divId) {
  const targetId = $(`#write-chat-${divId}`).data('chat');

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-typing', {
      groupId: targetId,
    });
  } else {
    socket.emit('user-is-typing', {
      contactId: targetId,
    });
  }
}

function typingOff(divId) {
  const targetId = $(`#write-chat-${divId}`).data('chat');

  if ($(`#write-chat-${divId}`).hasClass('chat-in-group')) {
    socket.emit('user-is-not-typing', {
      groupId: targetId,
    });
  } else {
    socket.emit('user-is-not-typing', {
      contactId: targetId,
    });
  }
}

$(document).ready(function () {
  // Listen event typing on
  socket.on('response-user-is-typing', function (response) {
    const messageTyping = `
      <div class="bubble you bubble-typing-gif">
        <img src="/images/chat/typing.gif" alt="typing-gif">
      </div>
    `;

    if (response.currentGroupId) {
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        let checkIsTyping = $(`.chat[data-chat=${response.currentGroupId}]`).find('div.bubble-typing-gif');
        if (checkIsTyping.length) {
          return;
        }
        $(`.chat[data-chat=${response.currentGroupId}]`).append(messageTyping);
        niceScrollRight(response.currentGroupId);
      }
    } else {
      let checkIsTyping = $(`.chat[data-chat=${response.currentUserId}]`).find('div.bubble-typing-gif');
      if (checkIsTyping.length) {
        return;
      }

      $(`.chat[data-chat=${response.currentUserId}]`).append(messageTyping);
      niceScrollRight(response.currentUserId);
    }
  });

  // Listen event typing off
  socket.on('response-user-is-not-typing', function (response) {
    if (response.currentGroupId) {
      if (response.currentUserId !== $('#dropdown-navbar-user').data('uid')) {
        $(`.chat[data-chat=${response.currentGroupId}]`).find('div.bubble-typing-gif').remove();
        niceScrollRight(response.currentGroupId);
      }
    } else {
      $(`.chat[data-chat=${response.currentUserId}]`).find('div.bubble-typing-gif').remove();
      niceScrollRight(response.currentUserId);
    }
  });
});
