const express = require('express')
const app = express();
const PORT = 5050
const mongoose = require('mongoose')
const clientRouter = require('./routers/clientRouter')
const customerRouter = require('./routers/customerRouter')
require('dotenv/config')
const cookieParser = require('cookie-parser')

// middleware
mongoose.set('strictQuery',false)
app.use(express.json())
app.use(cookieParser())
app.use(clientRouter)
app.use('/customer',customerRouter)
// testing routes
// app.get('/',(req,res)=>{
//     res.send('we heree')
// })

// connection to mongoDB
mongoose.connect(
  process.env.DBURL,
  () => console.log('DB connected successfully')
)
// listenng to port

app.listen(PORT,()=>console.log(`server running on port ${PORT}`))