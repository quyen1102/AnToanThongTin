
const express = require('express')
const app = express()

const port = 3000

const mainRouter = require('./src/router')




//middleware
app.use(express.static('./src/public'))
app.use(express.json())

app.use('/api/crypto', mainRouter)

app.listen(port, () => {
   console.log(`Sever listen on port ${port}`)
})