function decreaseNumberNotificationContact(className) {
  let currentValue = +$(`.${className}`).find('em').text(); // string to number
  --currentValue;
  if (currentValue === 0) {
    $(`.${className}`).html('');
  } else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}

function increaseNumberNotificationContact(className) {
  let currentValue = +$(`.${className}`).find('em').text(); // string to number
  console.log(currentValue);
  ++currentValue;
  if (currentValue === 0) {
    $(`.${className}`).html('');
  } else {
    $(`.${className}`).html(`(<em>${currentValue}</em>)`);
  }
}
