import * as sgMail from '@sendgrid/mail'
import {SENDGRID_KEY} from "../mailApiKey";
import {clientUrl, emailSender} from '../constants'
sgMail.setApiKey(SENDGRID_KEY)

export const sendSignUpMail = (email: string, token:string) => {
  const baseUrl = `${clientUrl}/signup/`
  const msg = {
    to: email,
    from: emailSender,
    subject: 'Uitnodiging voor Flexicon',
    text: `Hallo,\n
             \n
             Namens Flexicon ontvang je een uitnodiging voor de Flexicon Klanten Order Admin tool.\n
             \n
             Wij hebben nu al een account voor je angemaakt.\n
             Als je op onderstaande link klikt zul je gevraagd worden een wachtwoord voor je account aan te maken.
             \n
             ${baseUrl + token}`,
    html: `Hallo,\n
             \n
             Namens Flexicon ontvang je een uitnodiging voor de Flexicon Klanten Order Admin tool.\n
             \n
             Wij hebben nu al een account voor je angemaakt.\n
             Als je op onderstaande link klikt zul je gevraagd worden een wachtwoord voor je account aan te maken.
             <a href="${baseUrl + token}">${baseUrl + token}</a>`,
  }

  return sgMail.send(msg)
}

export const sendForgotPasswordMail = (email: string, token:string) => {
  const baseUrl = `${clientUrl}/wachtwoordvergeten/`
    const msg = {
    to: email,
    from: emailSender,
    subject: 'Wachtwoord opnieuw instellen voor Flexicon account',
    text: `Hallo,\n
             \n
             Je hebt een nieuwe wachtwoord voor je Flexicon account angevraagd.\n
             Klik alsjeblieft op onderstaande link om een nieuwe wachtwoord an te maken.
             \n
             ${baseUrl + token}`,
    html: `Hallo,\n
            \n
            Je hebt een nieuwe wachtwoord voor je Flexicon account angevraagd.\n
            Klik alsjeblieft op onderstaande link om een nieuwe wachtwoord an te maken.
            \n
             <a href="${baseUrl + token}">${baseUrl + token}</a>`,
  }

  return sgMail.send(msg)
}
