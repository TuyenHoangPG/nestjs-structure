$(document).ready(function () {
  $('#link-read-more-notif').bind('click', function () {
    let skipNumber = $('ul.list-notifications').find('li').length;

    $(this).css('display', 'none');
    $('.read-more-notif-loading').css('display', 'inline-block');

    $.get(`/notifications/read-more?skipNumber=${skipNumber}`, function (notifications) {
      if (notifications && notifications.length) {
        notifications.forEach(function (notification) {
          $('ul.list-notifications').append(`<li>${notification}</li>`); // modal notification
        });
      } else {
        alertify.notify('Bạn không còn thông báo nào để xem nữa cả.', 'error', 7);
      }
      $('#link-read-more-notif').css('display', 'inline-block');
      $('.read-more-notif-loading').css('display', 'none');
    });
  });
});
