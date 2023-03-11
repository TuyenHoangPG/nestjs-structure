let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};

function callLogout() {
  let timeInterval;

  Swal.fire({
    position: 'top-end',
    title: 'Tự động đăng xuất sau 5 giây.',
    html: 'Thời gian: <strong></strong>',
    timer: 5000,
    onBeforeOpen: () => {
      Swal.showLoading();
      timeInterval = setInterval(() => {
        Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      }, 1000);
    },
    onClose: () => {
      clearInterval(timeInterval);
    },
  }).then((result) => {
    $.get('/logout', function () {
      location.reload();
    });
  });
}

function updateUserInfo() {
  $('#inputChangeAvatar').bind('change', function () {
    const fileData = $(this).prop('files')[0];
    const match = ['image/png', 'image/jpg', 'image/jpeg'];
    const limit = 1048576; // Byte = 1MB

    if ($.inArray(fileData.type, match) === -1) {
      alertify.notify('Kiểu file không hợp lệ, chỉ chấp nhận JPG hoặc PNG.', 'error', 7);
      $(this).val('');
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify('Kích thước ảnh tối đa là 1MB.', 'error', 7);
      $(this).val('');
      return false;
    }

    if (typeof FileReader !== 'undefined') {
      const imagePreview = $('#image-edit-profile');
      imagePreview.empty();

      const fileReader = new FileReader();
      fileReader.onload = function (element) {
        $('<img>', {
          src: element.target.result,
          class: 'avatar img-circle',
          id: 'user-modal-avatar',
          alt: 'avatar',
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      let formData = new FormData();
      formData.append('avatar', fileData);

      userAvatar = formData;
    } else {
      alertify.notify('Trình duyệt của bạn không hỗ trợ FileReader.', 'error', 7);
    }
  });

  $('#inputUserName').bind('change', function () {
    let userName = $(this).val();
    const regex = new RegExp(
      /^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/,
    );

    if (userName.length < 3 || userName.length > 17 || !regex.test(userName)) {
      alertify.notify('Username giới hạn trong khoảng 3 - 17 kí tự và không được chứa kí tự đặc biệt.', 'error', 7);
      $(this).val(originUserInfo.userName);
      delete userInfo.userName;
      return false;
    }

    userInfo.userName = userName;
  });

  $('#inputGenderMale').bind('click', function () {
    let gender = $(this).val();

    if (gender !== 'male') {
      alertify.notify('Oops! Dữ liệu giới tính có vấn đề? Bạn là hacker chăng?', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $('#inputGenderFemale').bind('click', function () {
    let gender = $(this).val();

    if (gender !== 'female') {
      alertify.notify('Oops! Dữ liệu giới tính có vấn đề? Bạn là hacker chăng?', 'error', 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }

    userInfo.gender = gender;
  });

  $('#inputAddress').bind('change', function () {
    let address = $(this).val();

    if (address.length > 100) {
      alertify.notify('Địa chỉ giới hạn là 100 kí tự', 'error', 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }

    userInfo.address = address;
  });

  $('#inputPhone').bind('change', function () {
    let phone = $(this).val();
    const regex = new RegExp(/^(0)[0-9]{9,10}$/);

    if (!regex.test(phone)) {
      alertify.notify('Số điện thoại Việt Nam bắt đầu bằng số 0, giới hạn trong khoảng 10 - 11 ký tự', 'error', 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }

    userInfo.phone = phone;
  });

  $('#inputCurrentPassword').bind('change', function () {
    let currentPassword = $(this).val();
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (!regex.test(currentPassword)) {
      alertify.notify(
        'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt',
        'error',
        7,
      );
      $(this).val('');
      delete userUpdatePassword.currentPassword;
      return false;
    }

    userUpdatePassword.currentPassword = currentPassword;
  });

  $('#inputNewPassword').bind('change', function () {
    let newPassword = $(this).val();
    const regex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);

    if (!regex.test(newPassword)) {
      alertify.notify(
        'Mật khẩu chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.',
        'error',
        7,
      );
      $(this).val('');
      delete userUpdatePassword.newPassword;
      return false;
    }

    userUpdatePassword.newPassword = newPassword;
  });

  $('#inputConfirmPassword').bind('change', function () {
    let confirmPassword = $(this).val();

    if (!userUpdatePassword.newPassword) {
      alertify.notify('Bạn chưa nhập mật khẩu mới.', 'error', 7);
      $(this).val('');
      delete userUpdatePassword.confirmPassword;
      return false;
    }
    if (confirmPassword !== userUpdatePassword.newPassword) {
      alertify.notify('Xác nhận mật khẩu không chính xác.', 'error', 7);
      $(this).val('');
      delete userUpdatePassword.confirmPassword;
      return false;
    }

    userUpdatePassword.confirmPassword = confirmPassword;
  });
}

function callUpdateUserAvatar() {
  $.ajax({
    url: '/user/update-avatar',
    method: 'PUT',
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      console.log(result);
      // Display message
      $('.user-modal-alert-success').find('span').text(result.message);
      $('.user-modal-alert-success').css('display', 'block');

      // Update avatar in navbar
      $('#navbarAvatar').attr('src', result.imageSource);

      // Update origin avatar source
      originAvatarSrc = result.imageSource;

      // Refresh all
      $('#btnCancelUpdateUser').click();
    },
    error: function (error) {
      // Display error
      $('.user-modal-alert-error').find('span').text(error.responseText);
      $('.user-modal-alert-error').css('display', 'block');

      // Refresh all
      $('#btnCancelUpdateUser').click();
    },
  });
}

function callUpdateUserProfile() {
  $.ajax({
    url: '/user/update-profile',
    method: 'PUT',
    data: userInfo,
    success: function (result) {
      // Display message
      $('.user-modal-alert-success').find('span').text(result.message);
      $('.user-modal-alert-success').css('display', 'block');

      // Update origin user info
      originUserInfo = Object.assign({}, originUserInfo, userInfo);

      // Update username in navbar
      $('#navbar-username').text(originUserInfo.userName);

      // Refresh all
      $('#btnCancelUpdateUser').click();
    },
    error: function (error) {
      // Display error
      $('.user-modal-alert-error').find('span').text(error.responseText);
      $('.user-modal-alert-error').css('display', 'block');

      // Refresh all
      $('#btnCancelUpdateUser').click();
    },
  });
}

function callUpdatePassword() {
  $.ajax({
    url: '/user/update-password',
    method: 'PUT',
    data: userUpdatePassword,
    success: function (result) {
      // Display message
      $('.user-modal-password-alert-success').find('span').text(result.message);
      $('.user-modal-password-alert-success').css('display', 'block');

      // Refresh all
      $('#btnCancelUpdatePassword').click();

      // Logout after change password success
      callLogout();
    },
    error: function (error) {
      // Display error
      $('.user-modal-password-alert-error').find('span').text(error.responseText);
      $('.user-modal-password-alert-error').css('display', 'block');

      // Refresh all
      $('#btnCancelUpdatePassword').click();
    },
  });
}

$(document).ready(function () {
  // Get data original
  originAvatarSrc = $('#user-modal-avatar').attr('src');
  originUserInfo = {
    userName: $('#inputUserName').val(),
    gender: $('#inputGenderMale').is(':checked') ? $('#inputGenderMale').val() : $('#inputGenderFemale').val(),
    address: $('#inputAddress').val(),
    phone: $('#inputPhone').val(),
  };

  // Update user info after change value of control
  updateUserInfo();
  $('#btnUpdateUser').bind('click', function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify('Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu', 'error', 7);
      return;
    }

    if (userAvatar) {
      callUpdateUserAvatar();
    }
    if (!$.isEmptyObject(userInfo)) {
      callUpdateUserProfile();
    }
  });

  $('#btnCancelUpdateUser').bind('click', function () {
    userAvatar = null;
    userInfo = {};
    $('#user-modal-avatar').attr('src', originAvatarSrc);
    $('#inputChangeAvatar').val('');

    $('#inputUserName').val(originUserInfo.userName);
    originUserInfo.gender === 'male' ? $('#inputGenderMale').click() : $('#inputGenderFemale').click();
    $('#inputAddress').val(originUserInfo.address);
    $('#inputPhone').val(originUserInfo.phone);
  });

  $('#btnUpdatePassword').bind('click', function () {
    if (!(userUpdatePassword.currentPassword && userUpdatePassword.newPassword && userUpdatePassword.confirmPassword)) {
      alertify.notify('Bạn phải thay đổi đầy đủ thông tin', 'error', 7);
      return false;
    }

    Swal.fire({
      title: 'Bạn có chắc chắn muốn thay đổi mật khẩu ?',
      text: 'Bạn không thể hoản tác lại quá trình này!',
      type: 'info',
      showCancelButton: true,
      confirmButtonColor: '#2ECC71',
      cancelButtonColor: '#FF7675',
      confirmButtonText: 'Xác nhận',
      cancelButtonText: 'Hủy bỏ',
    }).then((result) => {
      if (!result.value) {
        $('#btnCancelUpdatePassword').click();
        return false;
      } else if (result.value) {
        callUpdatePassword();
      }
      // if (result.value) {
      //   Swal.fire(
      //     'Deleted!',
      //     'Your file has been deleted.',
      //     'success'
      //   )
      // }
    });
  });

  $('#btnCancelUpdatePassword').bind('click', function () {
    userUpdatePassword = {};
    $('#inputCurrentPassword').val('');
    $('#inputNewPassword').val('');
    $('#inputConfirmPassword').val('');
  });
});
