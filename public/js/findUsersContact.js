function callFindUsers(element) {
  if (element.which === 13 || element.type === 'click') {
    let keyword = $('#input-find-users-contact').val();
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

    $.get(`/contact/find-users/${keyword}`, function (data) {
      $('#find-user ul.contactList').html(data);
      addContact(); // js/addContact.js
      removeRequestContactSent(); // js/removeRequestContactSent.js
    });
  }
}

$(document).ready(function () {
  $('#input-find-users-contact').bind('keypress', callFindUsers);

  $('#btn-find-users-contact').bind('click', callFindUsers);
});
