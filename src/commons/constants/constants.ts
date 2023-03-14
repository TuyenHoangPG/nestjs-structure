export const APP_NAME = 'nest-structure';

export const MAIL_ACTIVE_ACCOUNT = {
  subject: 'Awesome Chat: Active your account',
  template: (linkActive) => `
    <h2>You received this email because you signed up for an account on the awesome Chat app</h2>
    <br/>
    <h3>Please click on the link below to confirm account activation</h3>
    <h3><a href="${linkActive}" target="blank">${linkActive}</a></h3>
    <br/>
    <h4>If this email is mistaken, ignore it!</h4>
  `,
};

export const REGISTER_SUCCESS = (email) =>
  `<span>Your account <strong>${email}</strong> has been created successfully. Please login to your email to activate this account<span>`;
