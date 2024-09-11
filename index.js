const express = require ("express");
const bodyparser = require ("body-parser");
const userRoute = require ("./routes/user")
const adminRoute  = require ("./routes/admin");
const doctorRoute  = require ("./routes/doctor");
const emergency_contacts = require("./routes/emergency_contact");
const SubscriptionPlan = require("./routes/subscription_plan");
const UserJobProfile = require("./routes/UserJobProfile");
const jobs = require("./routes/jobs");
const { swaggerUiSetup, swaggerUiDocument } = require('./swagger');

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.json()); // Middleware to parse JSON bodies



app.use('/api-docs', swaggerUiSetup, swaggerUiDocument);


app.use("/",userRoute);
app.use("/",emergency_contacts);
app.use("/",SubscriptionPlan);
app.use("/",UserJobProfile);
app.use("/",jobs);
app.use("/",doctorRoute);
app.use("/admin",adminRoute);



app.listen(1000);