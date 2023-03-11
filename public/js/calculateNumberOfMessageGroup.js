function increaseNumberOfMessage(divId) {
  let currentValue = +$(`.right[data-chat=${divId}]`).find('span.show-number-messages').text();
  currentValue++;
  $(`.right[data-chat=${divId}]`).find('span.show-number-messages').html(currentValue);
}
