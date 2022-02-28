
const express = require('express')
const router = express.Router()

const {
   encode,
   decode,
   generateKey
} = require('../controller/main')

router.route('/generateKey').post(generateKey)
router.route('/encode').post(encode)
router.route('/decode').post(decode)


module.exports = router