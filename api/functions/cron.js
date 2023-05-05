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

module.exports = () => {
    try {
        // Importing function for determining current date
        const date = require("./get_date.js")();
        const to = date.year + "-" + ("0" + (date.month)).slice(-2) + "-" + ("0" + (date.day)).slice(-2);

        for (let x in cotton_json_dates) {
            // Constructing paths to json files
            const path = `./data/${cotton_json_dates[x]}.json`;

            // Read the data.json file
            const data = fs.readFileSync(path, "utf8");

            // Parse the JSON data
            const json_data = JSON.parse(data);

            // Check if the "to" field (the last fetch of the yahoo finance api) in the JSON data is equal to to"s date
            if (json_data.to != to) {
                // Execute the functions for getting cotton prices
                require(`./yf_ctp/${cotton_json_dates[x]}.js`);
            } 
        }
    } catch (err) {
        console.error(err);
    }
}