// $ node dist/tests/getMissedCalls.js

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().getMissedCalls({
        from: new Date(Date.now() - 24 * 3600 * 1000),
        to: new Date(),
      }))

})()
