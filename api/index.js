// Importing necessary modules
const cron = require("node-cron");
require("dotenv").config({ path: "./env/.env" });
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");

// Initiating express app
const app = express();

// Setting up cors for the express app
const corsOptions = {
    origin: process.env.UI_URI,
};
app.use(cors(corsOptions));

// Parse requests of content-type - application/json
app.use(bodyParser.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Importing routes
app.use(require("./routes/index.js"));

// Import the function for the cron job
const cron_f = require("./functions/cron.js");

// Schedule the cron job to run every hour of the day
cron.schedule(process.env.PERIODS_CRON, () => {
    cron_f.periods();
});
// Schedule the cron job to run every 5 minutes
cron.schedule(process.env.GEN_INFO_CRON, () => {
    cron_f.gen_info();
});

// set port, listen for requests
const PORT = process.env.PORT || 5051;
app.listen(PORT, () => {
    console.log(`Port: ${PORT} ✅`);
});