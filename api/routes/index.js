// Import express module
const express = require("express");

// Initilialize express router
const router = express.Router();

// Import controller functions
const controllers = require("../functions/get_cotton_prices.js");

// Setting up the routes for getting cotton price json files
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

// Setting up default route for checking the status of the API
router.get("/", (req, res) => {
    controllers.check_route(req, res);
});

const gen_info = require("../functions/gen_info.js");
router.get("/get-gen-info", (req, res) => {
    try {
        gen_info.get(req, res);
    } catch (err) {
        console.error(err);
    }
})

for (let x in cotton_json_dates) {
    const single = cotton_json_dates[x];
    try {
        router.get("/get-cotton-prices/" + single, (req, res) => {
            controllers.get_cyf_prices(req, res, single);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("❌ Unexpected error occured");
    }
}

module.exports = router;