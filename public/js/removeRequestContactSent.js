function removeRequestContactSent() {
  $('.user-remove-request-contact-sent')
    .unbind('click')
    .on('click', function () {
      const targetId = $(this).data('uid');
      $.ajax({
        url: '/contact/remove-request-contact-sent',
        method: 'DELETE',
        data: {
          uid: targetId,
        },
        success: function (data) {
          if (data.success) {
            $('#find-user').find(`div.user-remove-request-contact-sent[data-uid=${targetId}]`).hide();
            $('#find-user').find(`div.user-add-new-contact[data-uid=${targetId}]`).css('display', 'inline-block');
            decreaseNumberNotification('noti_contact_counter', 1); // js/calculateRequest.js
            decreaseNumberNotificationContact('count-request-contact-sent'); // js/calculateRequestContact.js

            // Xóa ở modal tab đang chờ xác nhận
            $('#request-contact-sent').find(`li[data-uid=${targetId}]`).remove();

            // Xử lý real-time
            socket.emit('remove-request-contact-sent', { contactId: targetId });
          }
        },
      });
    });
}

socket.on('response-remove-request-contact-sent', function (user) {
  $('.noti_content').find(`div[data-uid=${user.id}]`).remove(); // popup notification
  $('ul.list-notifications').find(`li>div[data-uid=${user.id}]`).parent().remove(); // modal notification

  // Xóa ở modal yêu cầu kết bạn
  decreaseNumberNotificationContact('count-request-contact-received');
  $('#request-contact-received').find(`li[data-uid=${user.id}]`).remove();

  decreaseNumberNotification('noti_contact_counter', 1);
  decreaseNumberNotification('noti_counter', 1);
});

$(document).ready(function () {
  removeRequestContactSent();
});
