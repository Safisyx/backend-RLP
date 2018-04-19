"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sgMail = require("@sendgrid/mail");
const mailApiKey_1 = require("../mailApiKey");
sgMail.setApiKey(mailApiKey_1.MY_SENDGRID_KEY);
const sender = 'flexicon@example.com';
exports.sendSignUpMail = (email, token) => {
    const baseUrl = 'http://localhost:3000/signup/';
    const msg = {
        to: email,
        from: sender,
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
    };
    return sgMail.send(msg);
};
exports.sendForgotPasswordMail = (email, token) => {
    const baseUrl = 'http://localhost:3000/forgotpassword/';
    const msg = {
        to: email,
        from: sender,
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
    };
    return sgMail.send(msg);
};
//# sourceMappingURL=template.js.map