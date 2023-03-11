$(document).ready(function () {
  $('#link-read-more-contacts').bind('click', function () {
    let skipNumber = $('#contacts').find('li').length;

    $(this).css('display', 'none');
    $('.read-more-contacts-loading').css('display', 'inline-block');

    $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function (newContactUsers) {
      if (newContactUsers && newContactUsers.length) {
        newContactUsers.forEach(function (user) {
          $('#contacts').find('ul').append(`
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
                    <div class="user-talk" data-uid="${user._id}">
                        Trò chuyện
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="${user._id}">
                        Xóa liên hệ
                    </div>
                </div>
            </li>`); // modal notification
        });
      } else {
        alertify.notify('Bạn không còn bạn bè nào để xem nữa cả.', 'error', 7);
      }

      removeContact(); // js/removeContact
      $('#link-read-more-contacts').css('display', 'inline-block');
      $('.read-more-contacts-loading').css('display', 'none');
    });
  });
});
