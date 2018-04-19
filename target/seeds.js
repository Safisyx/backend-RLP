"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delivery_1 = require("./entities/delivery");
const db_1 = require("./db");
const user_1 = require("./entities/user");
const company_1 = require("./entities/company");
const seedDelivery = async () => {
    const delivery1 = {
        deliveryType: 'pakketdienst € 29,50',
        condition: 'bij schade kosteloos herstel'
    };
    const delivery2 = {
        deliveryType: 'postnl € 12,50',
        condition: 'geen reclamering bij schade mogelijk'
    };
    const delivery3 = {
        deliveryType: 'directe koerier vanaf € 29,50 regio Amsterdam, buiten amsterdam prijs op aanvraag',
        condition: 'bij schade kosteloos herstel'
    };
    await delivery_1.Delivery.create(delivery1).save();
    await delivery_1.Delivery.create(delivery2).save();
    await delivery_1.Delivery.create(delivery3).save();
};
const seedUser = async () => {
    const user = {
        lastName: 'User',
        firstName: 'Super',
        email: 'super@example.com',
        companyName: 'SUPER',
        role: 'Internal',
    };
    const password = 'SuperUser';
    const superUser = await user_1.User.create(user).save();
    await superUser.setPassword(password);
    await superUser.save();
};
const seedUserExternal = async () => {
    const user = {
        lastName: 'User',
        firstName: 'External',
        email: 'super2@example.com',
        companyName: 'SUPER',
        role: 'External',
        company: await company_1.Company.findOneById(1)
    };
    const password = 'SuperUser';
    const ExternalUser = await user_1.User.create(user).save();
    await ExternalUser.setPassword(password);
    await ExternalUser.save();
};
const seedCompany = async () => {
    const company = {
        companyName: 'Super',
        companyLogo: 'http://www.alancsmith.co.uk/logo/examples/bridgetriley.jpg'
    };
    const superCompany = await company_1.Company.create(company).save();
    await superCompany.save();
};
const runSeeds = async () => {
    await seedCompany();
    await seedDelivery();
    await seedUser();
    await seedUserExternal();
};
db_1.default()
    .then(async () => {
    try {
        await runSeeds();
        console.log('Seeds ran successfully');
        process.exit();
    }
    catch (err) {
        console.log('Something went wrong: ' + err.message);
        process.exit(1);
    }
});
//# sourceMappingURL=seeds.js.map