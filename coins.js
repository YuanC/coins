const https = require('https');
const util = require('util');
const cliff = require('cliff');

const start_time = (new Date).getTime();
const options = {
  hostname: 'api.coinmarketcap.com',
  path: '/v1/ticker/?convert=CAD&limit=100'
};

let coins_data;
try {
  coins_data = require('./coins_data.json'); // Portfolio coin data
} catch(e) {
  console.warn('Using default data...');
  coins_data = require('./coins_data_default.json');
}

https.get(options, function(res) {
  console.log();

  let res_body = '';
  res.on('data', (d) => {
    res_body += d;
  });

  res.on('end', () => {
    let market_data = JSON.parse(res_body);
    // console.log(market_data[0]);

    let conversion_rate = parseFloat(market_data[0].price_usd) / parseFloat(market_data[0].price_cad); 

    let total_value = 0;
    coins_data.coins.forEach(coin => {
      let temp_coin = market_data.find(c => c.id === coin.id);
      let value = temp_coin.price_cad*coin.balance;

      total_value += value;
    });

    let rows = [['%', 'Name', 'Symbol', 'Units', 'Price USD(CAD)', 'Value USD(CAD)']];
    coins_data.coins.forEach(coin => {
      let temp_coin = market_data.find(c => c.id === coin.id);
      let value = temp_coin.price_cad*coin.balance;

      rows.push([
        Math.round(value*100 / total_value),
        temp_coin.name,
        temp_coin.symbol,
        coin.balance.toFixed(3),
        temp_coin.price_usd + ' (' + temp_coin.price_cad + ')',
        Math.round(value*conversion_rate) + ' (' + Math.round(value) + ')'
      ]);
    });

    rows.sort((a, b) => b[0] - a[0]);
    console.log(cliff.stringifyRows(rows,['cyan', 'blue', 'green', 'yellow', 'magenta', 'grey']));
    
    let total_spent = coins_data.purchases.reduce((total, num) => { return total + num; });
    console.log('\nTotal spent:  %d CAD  %d USD',
      Math.round(total_spent),
      Math.round(total_spent*conversion_rate)
    );
    console.log('Total value:  %d CAD  %d USD',
      Math.round(total_value),
      Math.round(total_value*conversion_rate)
    );
    console.log('ROI:  %d CAD  %d USD (%d%)',
      Math.round(total_value - total_spent),
      Math.round(total_value*conversion_rate - total_spent*conversion_rate),
      Math.round((total_value/total_spent - 1)*100)
    );

    console.log('\n%ds', ((new Date).getTime() - start_time)/1000);
  });
});