// This is just a simple script I wrote to keep track of my cryptocurrency stuff

Yes, I was too lazy to write my own output formatting function, so I used a library for it.
All you need is NodeJS for this.

Put your data into a file in the root directory called 'coins_data.json'. If this file is not found, the script will default to coins_data_default.json
The default data json file also provides a template for how you should format the 'coins_data.json' file.
The json should be entered in accord with the public coinmarketcap API, as that is where the market data is being pulled from.

All you need to do is to run 'npm install' for the dependencies, and 'node coins' for the script.