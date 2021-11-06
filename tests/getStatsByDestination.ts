// $ node dist/tests/getStatsByDestination.js

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().getStatsByDestination({
        from: new Date(Date.now() - 30 * 24 * 3600 * 1000),
        to: new Date(),
      }))

})()
