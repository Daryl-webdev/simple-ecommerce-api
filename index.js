require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const jbwebtoken = require('jsonwebtoken');
const cors = require('cors');


const userRoute = require(__dirname + '/route/userRoute')
const productRoute = require(__dirname + '/route/productRoute')
const orderRoute = require(__dirname + '/route/orderRoute')
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

//==================================Data Base Set Up===================================
mongoose.connect("mongodb+srv://daryl:marklyrad24@grimaldo-b121.pnyea.mongodb.net/daryl-b121",
{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error"))
db.once('open', ()=> console.log("Connected to Cloud Data Base"))
//================================================================================


//===========================================Route================================
app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/orders', orderRoute)
//================================================================================



app.listen(port, ()=>console.log(`Server is listening on Port ${port}`))