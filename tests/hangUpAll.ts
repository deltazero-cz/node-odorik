// $ node dist/tests/hangUp.js ACTIVE_CALL_ID

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  const Odo = new Odorik()
  console.log(
      await Odo.getActiveCalls()
          .then(calls => calls.map((call : any) => call.id))
          .then(calls => Promise.all(calls.map(call => Odo.hangUp(call))))
  )

})()
