function videoChat(divId) {
  $(`#video-chat-${divId}`)
    .unbind('click')
    .on('click', function () {
      const targetId = $(this).data('chat');
      const callerName = $('#navbar-username').text();
      const dataToEmit = {
        listenerId: targetId,
        callerName,
      };

      // Step 1: Of caller
      socket.emit('caller-check-listener-online', dataToEmit);
    });
}

function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  video.srcObject = stream;
  video.onloadeddata = function () {
    video.play();
  };
}

function closeVideoStream(stream) {
  return stream.getTracks().forEach(function (track) {
    track.stop();
  });
}

$(document).ready(function () {
  // Step 2: Of caller
  socket.on('server-send-listener-is-offline', function () {
    alertify.notify('Người dùng hiện không trực tuyến', 'error', 7);
  });

  let iceServerList = $('#ice-server-list').val();

  let getPeerId = '';
  const peer = new Peer({
    key: 'peerjs',
    host: 'peerjs-server-trungquandev.herokuapp.com',
    secure: true,
    port: 443,
    config: {
      iceServers: JSON.parse(iceServerList),
    },
    debug: 3,
  });

  peer.on('open', function (peerId) {
    getPeerId = peerId;
  });
  // Step 3: Of listener
  socket.on('server-request-peer-id-of-listener', function (response) {
    const listenerName = $('#navbar-username').text();
    let dataToEmit = Object.assign({}, response, {
      listenerPeerId: getPeerId,
      listenerName,
    });

    // Step 4: Of listener
    socket.emit('listener-emit-peer-id-to-server', dataToEmit);
  });

  let timeInterval;

  // Step 5: Of caller
  socket.on('server-send-peer-id-of-listener-to-caller', function (response) {
    let dataToEmit = Object.assign({}, response);

    // Step 6: Of caller
    socket.emit('caller-request-call-to-server', dataToEmit);

    Swal.fire({
      title: `Đang gọi cho &nbsp;<span style="color: #2ecc71">${dataToEmit.listenerName}</span> &nbsp;<i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a"></strong> &nbsp; giây. <br/><br/>
        <button id="btn-cancel-call" class="btn btn-danger">Hủy cuộc gọi</button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-cancel-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Step 07: Of caller
            socket.emit('caller-cancel-request-call-to-server', dataToEmit);
          });

        if (Swal.getContent().querySelector('strong') !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        // Step 12: Of caller
        socket.on('server-send-reject-request-call-to-caller', function (response) {
          Swal.close();
          clearInterval(timeInterval);

          Swal.fire({
            type: 'info',
            title: `<span style="color: #2ecc71">${response.listenerName}</span> &nbsp; hiện tại không thể nghe máy`,
            backdrop: 'rgba(85, 85, 85, 0.4)',
            width: '52rem',
            allowOutsideClick: false,
            confirmButtonColor: '#2ecc71',
            confirmButtonText: 'Xác nhận',
          });
        });
      },
      onClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return;
    });
  });

  // Step 8: Of listener
  socket.on('server-send-request-call-to-listener', function (response) {
    let dataToEmit = Object.assign({}, response);

    Swal.fire({
      title: `<span style="color: #2ecc71">${dataToEmit.callerName}</span> &nbsp; muốn trò chuyện video với bạn &nbsp; <i class="fa fa-volume-control-phone"></i>`,
      html: `
        Thời gian: <strong style="color: #d43f3a"></strong> &nbsp; giây. <br/><br/>
        <button id="btn-accept-call" class="btn btn-success">Đồng ý</button>
        <button id="btn-reject-call" class="btn btn-danger">Từ chối</button>
      `,
      backdrop: 'rgba(85, 85, 85, 0.4)',
      width: '52rem',
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $('#btn-reject-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Step 10: Of listener
            socket.emit('listener-reject-request-call-to-server', dataToEmit);
          });

        $('#btn-accept-call')
          .unbind('click')
          .on('click', function () {
            Swal.close();
            clearInterval(timeInterval);

            // Step 11: Of listener
            socket.emit('listener-accept-request-call-to-server', dataToEmit);
          });

        if (Swal.getContent().querySelector('strong') !== null) {
          Swal.showLoading();
          timeInterval = setInterval(() => {
            Swal.getContent().querySelector('strong').textContent = Math.ceil(Swal.getTimerLeft() / 1000);
          }, 1000);
        }
      },
      onOpen: () => {
        // Step 9: Of listener
        socket.on('server-send-cancel-request-call-to-listener', function (response) {
          Swal.close();
          clearInterval(timeInterval);
        });
      },
      onClose: () => {
        clearInterval(timeInterval);
      },
    }).then((result) => {
      return;
    });
  });

  // Step 13: Of caller
  socket.on('server-send-accept-request-call-to-caller', function (response) {
    Swal.close();
    clearInterval(timeInterval);

    let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(
      navigator,
    );
    getUserMedia(
      { video: true, audio: true },
      function (stream) {
        // Show modal streaming
        $('#streamModal').modal('show');

        // Play caller's stream in local
        playVideoStream('local-stream', stream);

        // Call to listener
        let call = peer.call(response.listenerPeerId, stream);

        // listen and play stream of listener
        call.on('stream', function (remoteStream) {
          // Play listener's stream in local
          playVideoStream('remote-stream', remoteStream);
        });

        // Close modal: remove stream
        $('#streamModal').on('hidden.bs.modal', function () {
          closeVideoStream(stream);

          Swal.fire({
            type: 'info',
            title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ecc71">${response.listenerName}</span>`,
            backdrop: 'rgba(85, 85, 85, 0.4)',
            width: '52rem',
            allowOutsideClick: false,
            confirmButtonColor: '#2ecc71',
            confirmButtonText: 'Xác nhận',
          });
        });
      },
      function (err) {
        console.log('Failed to get local stream', err.toString());
        if (err.toString() === 'NotAllowedError: Permission denied') {
          alertify.notify(
            'Xin lỗi, bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại chức năng này trong phần cài đặt của trình duyệt.',
            'error',
            7,
          );
        }

        if (err.toString() === 'NotFoundError: Requested device not found') {
          alertify.notify('Xin lỗi, chúng tôi không tìm thấy thiết bị nghe gọi trên máy tính của bạn.', 'error', 7);
        }
      },
    );
  });

  // Step 14: Of listener
  socket.on('server-send-accept-request-call-to-listener', function (response) {
    Swal.close();
    clearInterval(timeInterval);

    var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(
      navigator,
    );

    peer.on('call', function (call) {
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          // Show modal streaming
          $('#streamModal').modal('show');

          // Play listener's stream in local
          playVideoStream('local-stream', stream);

          call.answer(stream); // Answer the call with an A/V stream.
          call.on('stream', function (remoteStream) {
            // Play caller's stream in local
            playVideoStream('remote-stream', remoteStream);
          });

          // Close modal: remove stream
          $('#streamModal').on('hidden.bs.modal', function () {
            closeVideoStream(stream);

            Swal.fire({
              type: 'info',
              title: `Đã kết thúc cuộc gọi với &nbsp; <span style="color: #2ecc71">${response.callerName}</span>`,
              backdrop: 'rgba(85, 85, 85, 0.4)',
              width: '52rem',
              allowOutsideClick: false,
              confirmButtonColor: '#2ecc71',
              confirmButtonText: 'Xác nhận',
            });
          });
        },
        function (err) {
          console.log('Failed to get local stream', err.toString());
          if (err.toString() === 'NotAllowedError: Permission denied') {
            alertify.notify(
              'Xin lỗi, bạn đã tắt quyền truy cập vào thiết bị nghe gọi trên trình duyệt. Vui lòng mở lại chức năng này trong phần cài đặt của trình duyệt.',
              'error',
              7,
            );
          }

          if (err.toString() === 'NotFoundError: Requested device not found') {
            alertify.notify('Xin lỗi, chúng tôi không tìm thấy thiết bị nghe gọi trên máy tính của bạn.', 'error', 7);
          }
        },
      );
    });
  });
});
