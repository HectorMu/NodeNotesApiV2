require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

//initialazing database connection
const initDatabase = require("./database")

//using middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//using the routes
app.use('/', require("./routes/indexRoutes.js"))

//initialazing the server
app.listen(port = 4000 || process.env.PORT,()=>{
    console.log(`Listening on port ${port}`)
})
