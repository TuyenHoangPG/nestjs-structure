function removeContact() {
  $('.user-remove-contact')
    .unbind('click')
    .on('click', function () {
      const targetId = $(this).data('uid');
      const userName = $(this).parent().find('div.user-name p').text();

      Swal.fire({
        title: `Bạn có chắc chắn muốn xóa ${userName} khỏi danh bạ ?`,
        text: 'Bạn không thể hoản tác lại quá trình này!',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#2ECC71',
        cancelButtonColor: '#FF7675',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
      }).then((result) => {
        if (!result.value) {
          return;
        } else if (result.value) {
          $.ajax({
            url: '/contact/remove-contact',
            method: 'DELETE',
            data: {
              uid: targetId,
            },
            success: function (data) {
              if (data.success) {
                $('#contacts').find(`ul li[data-uid=${targetId}]`).remove();
                decreaseNumberNotificationContact('count-contacts');

                // Xử lý real-time
                socket.emit('remove-contact', { contactId: targetId });

                // Handle chat after remove contact
                let checkActiveScreen = $('#all-chat').find(`li[data-chat=${targetId}]`).hasClass('active');
                // Step 1: Remove leftSide.ejs
                $('#all-chat').find(`ul a[href="#uid_${targetId}"]`).remove();
                $('#user-chat').find(`ul a[href="#uid_${targetId}"]`).remove();

                // Step 2: Remove rightSide.ejs
                $('#screen-chat').find(`div#to_${targetId}`).remove();

                // Step 3: Remove imageModal.ejs
                $('body').find(`div#imagesModal_${targetId}`).remove();

                // Step 4: Remove attachment.ejs
                $('body').find(`div#attachmentsModal_${targetId}`).remove();

                // Step 5: Click first conversation
                if (checkActiveScreen) {
                  $('ul.people').find('a')[0].trigger('click');
                }
              }
            },
          });
        }
      });
    });
}

socket.on('response-remove-contact', function (user) {
  $('#contacts').find(`ul li[data-uid=${user.id}]`).remove();
  decreaseNumberNotificationContact('count-contacts');

  // Handle chat after remove contact
  let checkActiveScreen = $('#all-chat').find(`li[data-chat=${user.id}]`).hasClass('active');
  // Step 1: Remove leftSide.ejs
  $('#all-chat').find(`ul a[href=#uid_${user.id}]`).remove();
  $('#user-chat').find(`ul a[href=#uid_${user.id}]`).remove();

  // Step 2: Remove rightSide.ejs
  $('#screen-chat').find(`div#to_${user.id}`).remove();

  // Step 3: Remove imageModal.ejs
  $('body').find(`div#imagesModal_${user.id}`).remove();

  // Step 4: Remove attachment.ejs
  $('body').find(`div#attachmentsModal_${user.id}`).remove();

  // Step 5: Click first conversation
  if (checkActiveScreen) {
    $('ul.people').find('a')[0].trigger('click');
  }
});

$(document).ready(function () {
  removeContact();
});
