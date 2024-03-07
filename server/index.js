const express = require('express')
const app = express()
const pool = require('./database')
const cors = require('cors')
const homeRoutes = require('./routes/home.js')
const customerRoutes = require('./routes/customer.js')
const sellerRoutes=require('./routes/seller.js')
const adminRoutes=require('./routes/admin.js')
const populate=require('./routes/populate.js')
const giftcard=require('./routes/giftcard.js')


app.use(express.json())
app.use(cors())

app.use('/',homeRoutes)
app.use('/customer',customerRoutes)
app.use('/Seller',sellerRoutes)
app.use('/giftcard',giftcard)
app.use('/populate',populate)
app.use('/admin',adminRoutes)

app.listen(5000, () => {
    console.log(`Server is listening to port 5000...`)
})
