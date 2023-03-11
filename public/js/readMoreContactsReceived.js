$(document).ready(function () {
  $('#link-read-more-contacts-received').bind('click', function () {
    let skipNumber = $('#request-contact-received').find('li').length;

    $(this).css('display', 'none');
    $('.read-more-contacts-received-loading').css('display', 'inline-block');

    $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function (newContactUsers) {
      if (newContactUsers && newContactUsers.length) {
        newContactUsers.forEach(function (user) {
          $('#request-contact-received').find('ul').append(`
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
                      <div class="user-accept-request-contact-received" data-uid="${user._id}">
                          Chấp nhận
                      </div>
                      <div class="user-remove-request-contact-received action-danger" data-uid="${user._id}">
                          Xóa yêu cầu
                      </div>
                  </div>
              </li>
            `);
        });
      } else {
        alertify.notify('Bạn không còn danh sách nào để xem nữa cả.', 'error', 7);
      }
      $('#link-read-more-contacts-received').css('display', 'inline-block');
      $('.read-more-contacts-received-loading').css('display', 'none');

      removeRequestContactReceived(); // js/removeRequestContactReceived.js
      acceptRequestContactReceived(); // js/acceptRequestContactReceived.js
    });
  });
});
