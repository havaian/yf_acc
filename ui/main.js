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

axios.get("http://localhost:5050/get-gen-info")
.then(res => {
    const exchange_rates = check_exchange_rates();
    const data = res.data["data"];
    console.log(data);
    $(".top_info_wrapper").html(
        `<h2>${data.price.shortName} (${data.price.symbol})</h2>`
    );
    let miw_text = ``;
    miw_text += 
        `
            <h1>¢${data.price.regularMarketPrice} / lb.</h1>
        `
    data.price.regularMarketPrice - data.price.regularMarketChange > 0 ? 
        miw_text += `<h2 class="change green">+${(data.price.regularMarketChange).toFixed(2)}</h2>` :
        miw_text += `<h2 class="change red">-${(data.price.regularMarketChange).toFixed(2)}</h2>`;
    data.price.regularMarketPrice - data.price.regularMarketPreviousClose > 0 ? 
        miw_text += `<h2 class="change percent green">(+${(data.price.regularMarketChangePercent * 100).toFixed(2)}%)</h3>` :
        miw_text += `<h2 class="change percent red">(-${(data.price.regularMarketChangePercent * 100).toFixed(2)}%)</h3>`;
    let biw_text = ``;
    biw_text += 
        `
            <h1>${(data.price.regularMarketPrice * exchange_rates.data["UZS"] / 100 * 2.2046226218489).toFixed(2)} so'm / kg.</h1>
        `
    data.price.regularMarketPrice - data.price.regularMarketChange > 0 ? 
        biw_text += `<h2 class="change green">+${(data.price.regularMarketChange * exchange_rates.data["UZS"] / 100 * 2.2046226218489).toFixed(2)}</h2>` :
        biw_text += `<h2 class="change red">-${(data.price.regularMarketChange * exchange_rates.data["UZS"] / 100 * 2.2046226218489).toFixed(2)}</h2>`;
    data.price.regularMarketPrice - data.price.regularMarketPreviousClose > 0 ? 
        biw_text += `<h2 class="change percent green">(+${(data.price.regularMarketChangePercent * 100).toFixed(2)}%)</h3>` :
        biw_text += `<h2 class="change percent red">(-${(data.price.regularMarketChangePercent * 100).toFixed(2)}%)</h3>`;
    $(".middle_info_wrapper").html(miw_text);
    $(".bot_info_wrapper").html(biw_text);
});

for (let x in periods) {
    axios.get(`http://localhost:5050/get-cotton-prices/${periods[x]}`)
    .then(async res => {
        const exchange_rates = check_exchange_rates();
        data["usd"][periods[x]] = res.data["data"];
        data["uzs"][periods[x]] = res.data["data"].map(obj => {
            // Create a new object with the same 'x' value
            const new_obj = { x: obj.x };
            // Multiply each value in 'y' array with exchange_rates.data["UZS"]
            new_obj.y = obj.y.map(val => (val * exchange_rates.data["UZS"] / 100 * 2.2046226218489).toFixed(2));
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