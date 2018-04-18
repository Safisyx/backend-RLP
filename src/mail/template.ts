import * as sgMail from '@sendgrid/mail'
import {MY_SENDGRID_KEY} from "../mailApiKey";

sgMail.setApiKey(MY_SENDGRID_KEY)

const sender = 'flexicon@example.com'

export const sendSignUpMail = (email: string, token:string) => {
  const baseUrl = 'http://localhost:3000/signup/'
  const msg = {
    to: email,
    from: sender,
    subject: 'Setup your password for Flexicon',
    text: `Hello,\n
             \n
             Thank you for choosing Flexicon.\n
             \n
             An account has been set for you.\n
             Please go to the following link to create your password
             \n
             ${baseUrl + token}`,
    html: `Hello,\n
             \n
             Thank you for choosing Flexicon.\n
             \n
             An account has been set for you.\n
             Please go to the following link to create your password\n
             <a href="${baseUrl + token}">${baseUrl + token}</a>`,
  }

  return sgMail.send(msg)
}

export const sendForgotPasswordMail = (email: string, token:string) => {
  const baseUrl = 'http://localhost:3000/forgotpassword/'
  const msg = {
    to: email,
    from: sender,
    subject: 'Reset your password for your account Flexicon',
    text: `Hello,\n
             \n
             You asked for a new password.\n
             Please go to the following link to create a new password
             \n
             ${baseUrl + token}`,
    html: `Hello,\n
            \n
            You asked for a new password.\n
            Please go to the following link to create a new password
            \n
             <a href="${baseUrl + token}">${baseUrl + token}</a>`,
  }

  return sgMail.send(msg)
}
