const fs = require("fs");
const yahooFinance = require("yahoo-finance");
require("dotenv").config({ path: "../env/.env" });

// Setting up the path to json file containing last day prices for the cotton
const cotton_json_path = "./data/daily.json";

// Setting up the ticker for the Yahoo Finance API
const ticker = process.env.TICKER;

// FUnction for getting number of days in a particular month of a particular year
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

// Setting up the current date in necessary format
const date = require("../get_date.js")();
const get_prev_date = () => {
    if (date.day - 1 > 0) {
        return  {
            day: date.day - 1,
            month: date.month,
            year: date.year
        }
    } else {
        let month = 0;
        let year = 0;
        let max_days = getDaysInMonth(month, date.year);
        if (date.month - 1 > 0) {
            month = date.month - 1;
            year = date.year;
        } else {
            month = date.month - 1 + 12;
            year = date.year - 1;
        }
        return {
            day: date.day - 1 + max_days,
            month: month,
            year: year
        }
    }
}
let date_adj = get_prev_date();
const to = date.year + "-" + ("0" + (date.month)).slice(-2) + "-" + ("0" + date.day).slice(-2);
const from = date_adj.year + "-" + ("0" + date_adj.month).slice(-2) + "-" + ("0" + date_adj.day).slice(-2);

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