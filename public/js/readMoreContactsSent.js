$(document).ready(function () {
  $('#link-read-more-contacts-sent').bind('click', function () {
    let skipNumber = $('#request-contact-sent').find('li').length;

    $(this).css('display', 'none');
    $('.read-more-contacts-sent-loading').css('display', 'inline-block');

    $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function (newContactUsers) {
      if (newContactUsers && newContactUsers.length) {
        newContactUsers.forEach(function (user) {
          $('#request-contact-sent').find('ul').append(`
              <li class="_contactList" data-uid="${user._id}">
                <div class="contactPanel">
                    <div class="user-avatar">
                        <img src="images/users/${user.avatar}" alt="">
                    </div>
                    <div class="user-name">
                        <p>
                            ${user.userName}
                        </p>
                    </div>
                    <br>
                    <div class="user-address">
                        <span>&nbsp ${user.address || ''}</span>
                    </div>
                    <div class="user-remove-request-contact-sent action-danger display-important" data-uid="${
                      user._id
                    }">
                        Hủy yêu cầu
                    </div>
                </div>
            </li>
            `);
        });
      } else {
        alertify.notify('Bạn không còn danh sách nào để xem nữa cả.', 'error', 7);
      }
      $('#link-read-more-contacts-sent').css('display', 'inline-block');
      $('.read-more-contacts-sent-loading').css('display', 'none');

      removeRequestContactSent(); // removeRequestContactSent.js
    });
  });
});
