// Importing file system module
const fs = require("fs");

// Setting up the path to json files containing prices for the cotton
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

exports.check_route = (req, res) => {
    try {
        res.status(200).json({
            message: `Yahoo Finance Cotton Feature Price API: It's working! 🙌`,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Unexpected error occured");
    };
}

exports.get_cyf_prices = (req, res, period) => {
    try {
        const data = fs.readFileSync(`./data/${period}.json`, 'utf8');
        res.status(200).send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Unexpected error occured");
    };
}