const express = require('express')
const app = express()
const pool = require('./database')
const cors = require('cors')
const homeRoutes = require('./routes/home.js')
const customerRoutes = require('./routes/customer.js')



app.use(express.json())
app.use(cors())

app.use('/',homeRoutes)
app.use('/customer',customerRoutes)

app.listen(5000, () => {
    console.log(`Server is listening to port 5000...`)
})
