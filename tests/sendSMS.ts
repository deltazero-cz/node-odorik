// $ node dist/tests/sendSMS.js YOUR_NUMBER YOUR TEXT MESSAGE HERE

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().sendSMS({
        recipient: process.argv[2],
        message: process.argv.slice(3).join(' ')
      }))

})()
