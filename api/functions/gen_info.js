// Import necessary modules
const { json } = require("express");
const fs = require("fs");
require("dotenv").config();
const yahooFinance = require("yahoo-finance");

// Setting up the path to the json file
const get_info_json_path = "./data/summary.json";

// Get ticker variable from env file
const ticker = process.env.TICKER;

// Setting up the current date in necessary format
const date = require("./get_date.js")();

const last_fetch = date.year + "-" + ("0" + (date.month)).slice(-2) + "-" + ("0" + date.day).slice(-2);

exports.fetch = async () => {
    try {
        // Read the json file with data
        const data = fs.readFileSync(get_info_json_path, "utf8");

        // Parse the JSON data
        const json_data = JSON.parse(data);

        if (json_data.last_fetch != last_fetch) {
            await yahooFinance.quote({
                symbol: ticker,
                modules: [ "summaryDetail", "price" ]       // optional; default modules.
            }, function(err, quote) {
                if (err) {
                    console.error(err);
                }
                const data = {
                    "last_fetch": last_fetch,
                    "data": quote
                };
                fs.writeFileSync(get_info_json_path, JSON.stringify(data));
            });
        }
    } catch (err) {
        console.error(err);
    }
};

exports.get = async (req, res) => {
    try {
        // Read the json file with data
        const data = fs.readFileSync(get_info_json_path, "utf8");
    
        // Parse the JSON data
        const json_data = JSON.parse(data);
        
        res.status(200).send(json_data);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Unexpected error occured");
    }
}