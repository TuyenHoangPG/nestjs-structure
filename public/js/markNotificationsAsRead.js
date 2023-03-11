function markNotificationsAsRead(targetUsers) {
  $.ajax({
    url: '/notification/mark-all-as-read',
    method: 'PUT',
    data: {
      targetUsers,
    },
    success: function (result) {
      if (result) {
        targetUsers.forEach(function (userId) {
          $('.noti_content').find(`div[data-uid=${userId}]`).removeClass('notif-is-not-read');
          $('ul.list-notifications').find(`li>div[data-uid=${userId}]`).removeClass('notif-is-not-read');
        });

        decreaseNumberNotification('noti_counter', targetUsers.length);
      }
    },
  });
}

$(document).ready(function () {
  // link at popup notification
  $('#popup-mark-notif-as-read').bind('click', function () {
    let targetUsers = [];
    $('.noti_content')
      .find('div.notif-is-not-read')
      .each(function (index, notification) {
        targetUsers.push($(notification).data('uid'));
      });

    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc.', 'error', 7);
      return;
    }
    markNotificationsAsRead(targetUsers);
  });

  // link at modal notification
  $('#modal-mark-notif-as-read').bind('click', function () {
    let targetUsers = [];
    $('ul.list-notifications')
      .find('li>div.notif-is-not-read')
      .each(function (index, notification) {
        targetUsers.push($(notification).data('uid'));
      });

    if (!targetUsers.length) {
      alertify.notify('Bạn không còn thông báo nào chưa đọc.', 'error', 7);
      return;
    }
    markNotificationsAsRead(targetUsers);
  });
});
