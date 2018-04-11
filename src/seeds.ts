import {Delivery} from './entities/delivery'
import setupDb from './db'

const seedDelivery = async () => {
  const delivery1 = {
    deliveryType: 'pakketdienst € 29,50',
    condition: 'bij schade kosteloos herstel'
  }
  const delivery2 = {
    deliveryType: 'postnl € 12,50',
    condition: 'geen reclamering bij schade mogelijk'
  }
  const delivery3 = {
    deliveryType: 'directe koerier vanaf € 29,50 regio Amsterdam, buiten amsterdam prijs op aanvraag',
    condition: 'bij schade kosteloos herstel'
  }

  await Delivery.create(delivery1).save()
  await Delivery.create(delivery2).save()
  await Delivery.create(delivery3).save()
}

const runSeeds = async () => {
  await seedDelivery()
}

setupDb()
  .then(async () => {
    try {
      await runSeeds()
      console.log('Seeds ran successfully')
      process.exit()
    } catch (err) {
      console.log('Something went wrong: ' + err.message)
      process.exit(1)
    }
  })
