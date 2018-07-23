const BigNumber = require('bignumber.js');
const sendSync = require(__dirname + '/transfer');
const config = require(__dirname + '/config');
const utils = require(__dirname + '/utils');
const fs = require('fs');
const moment = require('moment');

let contract = config.contract;
let web3 = config.web3;


// airdrop account
let from_account = {
  address: 'your account address',
  privateKey: 'your private key'
}

let to_address = 'your receive address';

let amount = 1;



var main = async function(){	
	console.log(moment().format());
	var gas_price = await utils.getNetGasPrice();
	web3.eth.accounts.wallet.add(from_account);
	let {err, result} = await sendSync(to_address, amount, from_account.address, gas_price);
	console.log("from:", from_account.address, " to:", to_address, " amount:", amount, err, result);
}

main();