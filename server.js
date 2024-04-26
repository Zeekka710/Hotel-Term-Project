const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const cors = require('cors');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

const app = express();

app.use(cors());
//Route files
const hotels = require('./routes/hotel');
const bookings = require('./routes/booking');
const auth = require('./routes/auth');
const {xss}=require('express-xss-sanitizer');

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter=rateLimit({
    windowsMs:10*60*1000,//10 mins
max: 10 });
app.use(limiter);

//Mount routers
app.use('/api/v1/hotels', hotels);
app.use('/api/v1/auth',auth);
app.use('/api/v1/bookings', bookings);


const PORT =process.env.PORT || 5001;

const server = app.listen(PORT, console.log('Server running in', process.env.NODE_ENV, 'mode on port', PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
});