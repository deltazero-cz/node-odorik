// $ node dist/tests/getActiveCalls.js

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().getActiveCalls())

})()
