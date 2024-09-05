const express = require ("express");
const bodyparser = require ("body-parser");
const path = require('path');
const userRoute = require ("./routes/user")
const adminRoute  = require ("./routes/admin");
const doctorRoute  = require ("./routes/doctor");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));



app.use(express.json()); // Middleware to parse JSON bodies



app.use("/",userRoute);
app.use("/admin",adminRoute);
app.use("/doctor",doctorRoute);



app.listen(1000);