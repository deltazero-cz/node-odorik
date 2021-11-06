// $ node dist/tests/callback.js YOUR_NUMBER DEST_NUMBER

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().callback(process.argv[2], process.argv[3]))

})()
