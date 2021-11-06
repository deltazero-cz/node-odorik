// $ node dist/tests/getSMSAllowedSenders.js

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().getSMSAllowedSenders())

})()
