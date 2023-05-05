const fs = require("fs");
const yahooFinance = require("yahoo-finance");
require("dotenv").config({ path: "../env/.env" });

// Setting up the path to json file containing yearly prices for the cotton
const cotton_json_path = "./data/yearly.json";

// Setting up the ticker for the Yahoo Finance API
const ticker = process.env.TICKER;

// Setting up the current date in necessary format
const date = require("../get_date.js")();
const to = date.year + "-" + ("0" + (date.month)).slice(-2) + "-" + ("0" + date.day).slice(-2);
const from = date.year - 1 + "-" + ("0" + (date.month)).slice(-2) + "-" + ("0" + date.day).slice(-2);

// Function for getting data from Yahoo Finance
module.exports = yahooFinance.historical(
    {
        from: from,
        to: to,
        symbol: ticker,
        period: "d",
    },
    (err, quotes) => {
        if (err) {
            throw err;
        }
        if (quotes[0]) {
            // Store data from Yahoo Finance API to an object
            const data = Object.entries(quotes).map(([key, value]) => ({
                x: Date.parse(value.date),
                y: [
                    parseFloat(value.open / 100 * 2.2046226218489).toFixed(2), 
                    parseFloat(value.high / 100 * 2.2046226218489).toFixed(2), 
                    parseFloat(value.low / 100 * 2.2046226218489).toFixed(2), 
                    parseFloat(value.close / 100 * 2.2046226218489).toFixed(2)
                ],
            }));
            const cotton_data = {
                from: from,
                to: to,
                data: data,
            };
            // Write the data to json file containing yearly prices for the cotton
            fs.writeFileSync(cotton_json_path, JSON.stringify(cotton_data));
        }    
    }
)