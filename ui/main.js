const get_date = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + currentDate.getDate()).slice(-2);
    return {
        day,
        month,
        year,
    }
}

const check_exchange_rates = () => {
    const date = get_date();
    const to = date.year + "-" + ("0" + (date.month)).slice(-2) + "-" + date.day;

    const exchange_data = JSON.parse(localStorage.getItem('exchange_rates'));
    if (!exchange_data || !exchange_data.date || !exchange_data.data || exchange_data.date !== to) {
        axios.get("https://api.exchangerate-api.com/v4/latest/usd")
        .then(res => {
            const exchange_rates = {
                data: res.data["rates"],
                date: to,
            };
            localStorage.setItem('exchange_rates', JSON.stringify(exchange_rates));
        });
        return exchange_data;
    } else {
        return exchange_data;
    }
};

const periods = [
    "daily",
    "weekly",
    "monthly",
    "three_months",
    "half_year",
    "yearly",
    "three_years",
    "five_years",
];

const data = {
    "usd": {},
    "uzs": {},
}
const options = {
    "usd": {},
    "uzs": {}
}

for (let x in periods) {
    axios.get(`http://localhost:5050/get-cotton-prices/${periods[x]}`)
    .then(async res => {
        const exchange_rates = check_exchange_rates();
        data["usd"][periods[x]] = res.data["data"];
        data["uzs"][periods[x]] = res.data["data"].map(obj => {
            // Create a new object with the same 'x' value
            const new_obj = { x: obj.x };
            // Multiply each value in 'y' array with exchange_rates.data["UZS"]
            new_obj.y = obj.y.map(val => (val * exchange_rates.data["UZS"]).toFixed(2));
            return new_obj;
        });

        options["usd"][periods[x]] = {
            series: [{
                data: await data["usd"][periods[x]]
            }],
            chart: {
                type: 'candlestick',
                height: 350
            },
            title: {
                text: 'Real-time Cotton Prices (USD)',
                align: 'left'
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        };
        options["uzs"][periods[x]] = {
            series: [{
                data: await data["uzs"][periods[x]]
            }],
            chart: {
                type: 'candlestick',
                height: 350
            },
            title: {
                text: 'Real-time Cotton Prices (UZS)',
                align: 'left'
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        };

        if (periods[x] === "yearly") {
            // Create new USD and UZS charts with last year's data
            var chart_usd = new ApexCharts(document.querySelector("#chart-usd"), options["usd"][periods[x]]);
            var chart_uzs = new ApexCharts(document.querySelector("#chart-uzs"), options["uzs"][periods[x]]);

            // Initial render of USD and UZS charts with last year's data
            chart_usd.render();
            chart_uzs.render();
        }

        $('#' + periods[x]).click((e) => {
            // Add new data to USD and UZS charts
            var chart_usd = new ApexCharts(document.querySelector("#chart-usd"), options["usd"][periods[x]]);
            var chart_uzs = new ApexCharts(document.querySelector("#chart-uzs"), options["uzs"][periods[x]]);

            // Clean empty USD and UZS charts
            $("#chart-usd").empty();
            $("#chart-uzs").empty();

            // Render both USD and UZS charts
            chart_usd.render();
            chart_uzs.render();

            // Remove the "active" class from all elements
            $(".chart-period-btn").removeClass("active");

            // Add the "active" class to the clicked element
            $('#' + periods[x]).toggleClass("active");
        })
    });
}