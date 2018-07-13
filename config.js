const Web3 = require('web3');
const fs = require('fs');

const abi = fs.readFileSync('<your contract abi file>');
// const test = false;
const test = false;

const gas_price = 24; // set the highest gas price you can afford
const gas_amount = 60000;
const mongourl = 'mongodb://<monge address>';
const sleep_time = 60 * 1000;

// used for token transfer
main_account = {
  address: '...',
  privateKey: '...'
}

if (test){
  var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/"));
  var contract = new web3.eth.Contract(JSON.parse(abi.toString()), "...");  // your contract address 
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/"));
  var contract = new web3.eth.Contract(JSON.parse(abi.toString()), "...");  // your contract address
}

let config = {
  test: test,
  gas_price: gas_price,
  gas_amount: gas_amount,
  web3: web3,
  contract: contract,
  main_account: main_account,
  mongourl: mongourl,
  sleep_time: sleep_time
}

module.exports = config;
