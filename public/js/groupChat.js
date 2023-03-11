function addFriendsToGroup() {
  $('ul#group-chat-friends')
    .find('div.add-user')
    .bind('click', function () {
      let uid = $(this).data('uid');
      $(this).remove();
      let html = $('ul#group-chat-friends')
        .find('div[data-uid=' + uid + ']')
        .html();

      let promise = new Promise(function (resolve, reject) {
        $('ul#friends-added').append(html);
        $('#groupChatModal .list-user-added').show();
        resolve(true);
      });
      promise.then(function (success) {
        $('ul#group-chat-friends')
          .find('div[data-uid=' + uid + ']')
          .remove();
      });
    });
}

function cancelCreateGroup() {
  $('#btn-cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}

function callSearchFriends(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-search-friends-to-add-group-chat').val();
    let regex = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
    );
    if (!keyword.length) {
      alertify.notify('Chưa nhập nội dung tìm kiếm.', 'error', 7);
      return;
    }

    if (!regex.test(keyword)) {
      alertify.notify('Lỗi từ khóa tìm kiếm. Chỉ cho phép kí tự chữ cái và số.', 'error', 7);
      return;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      $('ul#group-chat-friends').html(data);

      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
}

function callCreateGroupChat() {
  $('#btn-create-group-chat')
    .unbind('click')
    .on('click', function () {
      let countUsers = $('ul#friends-added').find('li');

      if (countUsers.length < 2) {
        alertify.notify('Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu 2 người.', 'error', 7);
        return;
      }

      let groupChatName = $('#input-name-group-chat').val();
      const regex = new RegExp(
        /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
      );
      if (groupChatName < 5 || groupChatName > 30 || !regex.test(groupChatName)) {
        alertify.notify(
          'Vui lòng nhập tên cuộc trò chuyện giới hạn 5 - 30 ký tự và không chứa ký tự đặc biệt',
          'error',
          7,
        );
        return;
      }

      let arrIds = [];
      $('ul#friends-added')
        .find('li')
        .each(function (index, element) {
          arrIds.push({
            userId: $(element).data('uid'),
          });
        });

      Swal.fire({
        title: `Bạn có chắc chắn muốn tạo nhóm &nbsp; ${groupChatName} ?`,
        type: 'info',
        showCancelButton: true,
        confirmButtonColor: '#2ECC71',
        cancelButtonColor: '#FF7675',
        confirmButtonText: 'Xác nhận',
        cancelButtonText: 'Hủy bỏ',
      }).then((result) => {
        if (!result.value) {
          return false;
        } else if (result.value) {
          $.post(
            '/group-chat/add-new',
            {
              arrIds,
              groupChatName,
            },
            function (data) {
              // Step 1: Hide modal
              $('#input-name-group-chat').val('');
              $('#btn-cancel-group-chat').trigger('click');
              $('#groupChatModal').modal('hide');

              // Step 2: Handle leftSide.ejs
              let leftSideData = `
            <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
              <li class="person group-chat" data-chat="${data.groupChat._id}">
                <div class="left-avatar">
                  <img src="images/users/group-avatar-trungquandev.png" alt="">
                </div>
                <span class="name">
                  <span class="group-chat-name">${data.groupChat.name}</span>
                </span>
                <span class="time"></span>
                <span class="preview">
                </span>
              </li>
            </a>
          `;
              $('#all-chat').find('ul').prepend(leftSideData);
              $('#group-chat').find('ul').prepend(leftSideData);

              // Step 3: Handle rightSide.ejs
              let rightSideData = `
            <div class="right tab-pane" id="to_${data.groupChat._id}">
              <div class="top">
                <span>To: <span class="name">${data.groupChat.name}</span></span>
                <span class="chat-menu-right">
                  <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                    Tệp đính kèm
                    <i class="fa fa-paperclip"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                    Hình ảnh
                    <i class="fa fa-photo"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                    <span class="show-number-members">${data.groupChat.userAmount}</span>
                    <i class="fa fa-users"></i>
                  </a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                  <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                    <span class="show-number-messages">${data.groupChat.messageAmount}</span>
                    <i class="fa fa-comment-o"></i>
                  </a>
                </span>
              </div>
              <div class="content-chat">
                <div class="chat chat-in-group" data-chat="${data.groupChat._id}">
                </div>
              </div>
              <div class="write" data-chat="${data.groupChat._id}">
                <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${data.groupChat._id}">
                    <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                    <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${data.groupChat._id}">
                    <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                    <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-group" class="video-chat chat-in-group">
                    <i class="fa fa-video-camera"></i>
                  </a>
                </div>
              </div>
            </div>
          `;
              $('#screen-chat').prepend(rightSideData);

              // Step 4: Call function changeScreenChat()
              changeScreenChat();

              // Step 5: Handle imageModal.ejs
              let imageModalData = `
            <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.</h4>
                      </div>
                      <div class="modal-body">
                          <div class="all-images" style="visibility: hidden;">
                          </div>
                      </div>
                  </div>
              </div>
            </div>
          `;
              $('body').append(imageModalData);

              // Step 6: Call function gridPhotos()
              gridPhotos(5);

              // Step 7: Handle attachmentModal.ejs
              let attachmentModalData = `
            <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
              <div class="modal-dialog modal-lg">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal">&times;</button>
                          <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
                      </div>
                      <div class="modal-body">
                          <ul class="list-attachments">
                          </ul>
                      </div>
                  </div>
              </div>
            </div>
          `;
              $('body').append(attachmentModalData);

              // Step 8: Emit event new group created
              socket.emit('new-group-created', {
                groupChat: data.groupChat,
              });

              // Step 9: Update online
              socket.emit('check-status');
            },
          ).fail(function (response) {
            console.log(response);
            alertify.notify(response.responseText, 'error', 7);
          });
        }
      });
    });
}

$(document).ready(function () {
  callCreateGroupChat();
  $('#input-search-friends-to-add-group-chat').bind('keypress', callSearchFriends);

  $('#btn-search-friends').bind('click', callSearchFriends);

  socket.on('response-new-group-created', function (response) {
    // Step 1: Handle leftSide.ejs
    let leftSideData = `
      <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
        <li class="person group-chat" data-chat="${response.groupChat._id}">
          <div class="left-avatar">
            <img src="images/users/group-avatar-trungquandev.png" alt="">
          </div>
          <span class="name">
            <span class="group-chat-name">${response.groupChat.name}</span>
          </span>
          <span class="time"></span>
          <span class="preview">
          </span>
        </li>
      </a>
    `;
    $('#all-chat').find('ul').prepend(leftSideData);
    $('#group-chat').find('ul').prepend(leftSideData);

    // Step 2: Handle rightSide.ejs
    let rightSideData = `
      <div class="right tab-pane" id="to_${response.groupChat._id}">
        <div class="top">
          <span>To: <span class="name">${response.groupChat.name}</span></span>
          <span class="chat-menu-right">
            <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
              Tệp đính kèm
              <i class="fa fa-paperclip"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
              <span class="show-number-members">${response.groupChat.userAmount}</span>
              <i class="fa fa-users"></i>
            </a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
          </span>
          <span class="chat-menu-right">
            <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
              <span class="show-number-messages">${response.groupChat.messageAmount}</span>
              <i class="fa fa-comment-o"></i>
            </a>
          </span>
        </div>
        <div class="content-chat">
          <div class="chat chat-in-group" data-chat="${response.groupChat._id}">
          </div>
        </div>
        <div class="write" data-chat="${response.groupChat._id}">
          <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
          <div class="icons">
            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
            <label for="image-chat-${response.groupChat._id}">
              <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
              <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${response.groupChat._id}">
              <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
              <i class="fa fa-paperclip"></i>
            </label>
            <a href="javascript:void(0)" id="video-chat-group" class="video-chat chat-in-group">
              <i class="fa fa-video-camera"></i>
            </a>
          </div>
        </div>
      </div>
    `;
    $('#screen-chat').append(rightSideData);

    // Step 3: Call function changeScreenChat()
    changeScreenChat();

    // Step 4: Handle imageModal.ejs
    let imageModalData = `
      <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện.</h4>
                </div>
                <div class="modal-body">
                    <div class="all-images" style="visibility: hidden;">
                    </div>
                </div>
            </div>
        </div>
      </div>
    `;
    $('body').append(imageModalData);

    // Step 5: Call function gridPhotos()
    gridPhotos(5);

    // Step 6: Handle attachmentModal.ejs
    let attachmentModalData = `
      <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Những tệp đính kèm trong cuộc trò chuyện.</h4>
                </div>
                <div class="modal-body">
                    <ul class="list-attachments">
                    </ul>
                </div>
            </div>
        </div>
      </div>
    `;
    $('body').append(attachmentModalData);

    // Step 7: Emit when members are added group chat
    socket.emit('members-added-group-chat', { groupChatId: response.groupChat._id });

    // Step 8: Update online
    socket.emit('check-status');
  });
});
