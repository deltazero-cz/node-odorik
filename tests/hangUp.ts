// $ node dist/tests/hangUp.js ACTIVE_CALL_ID

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().hangUp(parseInt(process.argv[2])))

})()
