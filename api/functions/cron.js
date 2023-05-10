// Importing file system module
const fs = require("fs");

// Setting up the path to json file containing yearly prices for the cotton
const cotton_json_dates = [
    "daily",
    "weekly",
    "monthly",
    "three_months",
    "half_year",
    "yearly",
    "three_years",
    "five_years",
];

exports.periods = () => {
    try {
        for (let x in cotton_json_dates) {
            // Execute the functions for getting cotton prices
            require(`./yf_ctp/${cotton_json_dates[x]}.js`);
        }
    } catch (err) {
        console.error(err);
    }
}

exports.gen_info = () => {
    try {
        // Importing function for fetching general info
        const gen_info = require("../functions/gen_info.js");
        gen_info.fetch();
    } catch (err) {
        console.error(err);
    }
}