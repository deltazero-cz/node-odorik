// $ node dist/tests/getPublicRoutes.js YOUR_PUBLIC_NUMBER
// use in full international format

import Odorik from '../index.js'
import * as dotenv from 'dotenv'

(async () => {
  dotenv.config()

  console.log(
      await new Odorik().getPublicRoutes(process.argv[2]))

})()