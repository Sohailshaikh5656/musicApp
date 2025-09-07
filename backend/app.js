const express = require("express")
const dotenv = require("dotenv")
const colors = require("colors")
const cors = require("cors")
const multer = require("multer")
const app = express()
const path = require('path');
const cron = require("node-cron");

app.use(express.text())
dotenv.config()
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
}));
// cron.schedule("* * * * *", () => {
//   console.log("🚀 Cron Job Running every 1 minute...");
//   // yaha tu apna fetch + AI process call karega
// });
app.use(require('./middleware/validation').validateHeaderToken);
app.use(require('./middleware/validation').extractHeaderLanguage);
app.use(require('./middleware/validation').validateApiKey);
app.use(require('./middleware/validation').DecriptData);
let app_routing = require("./modules/app_routing")
app_routing.v1(app)
app.use("/uploads",express.static(path.join(__dirname,'uploads')));
try{
    app.listen(process.env.PORT || 3300,()=>{
        console.log(`App Started on ${process.env.PORT || 3300} PORT`.bgGreen)
    })
}catch(error){
    console.log(`Error in Server : ${error}`.bgRed.white)
}