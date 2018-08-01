const BigNumber = require('bignumber.js');
const sendSync = require(__dirname + '/transfer');
const config = require(__dirname + '/config');
const utils = require(__dirname + '/utils');
const fs = require('fs');

const getTransactionSync = function(tx){
  return new Promise((resolve,reject)=>{
    config.web3.eth.getTransaction(tx).then(function(resp){
        resolve(resp);
    });
  })
}
// airdrop account
from_account = {
  address: 'your address',
  privateKey: 'your privateKey'
}

config.web3.eth.accounts.wallet.add(from_account);
let contract = config.contract;

let to_accounts = [
]

const done_list = fs.readFileSync(__dirname + '/done_list.txt', 'utf-8');
console.log(done_list);

const send_list = fs.readFileSync(__dirname + '/send_list.txt', 'utf-8');
let accounts = send_list.split('\n');
for(let i=0; i<accounts.length; i++){
  if (accounts[i] != ''){
    let rows = accounts[i].split('\t');
    if (done_list.indexOf(rows[0]) > -1){
      console.log(rows[0], "has sent");
    } else {
      console.log(i, rows[0], parseInt(rows[1]));
      to_accounts.push({
        address: rows[0],
        amount: parseInt(rows[1])
      });
    }
  }
}

var query_tx = async function(tx) {
  console.log("start to query tx:" + tx);
  while(true){
    let resp = await getTransactionSync(tx);
    if (resp){
      if (resp["blockNumber"] != null){
        console.log("tx:" + tx + "  verified." );
        console.log(resp);
        return ;
      } else {
        console.log("no blockNumber. tx=" + tx);
      }
    } else {
      console.log("no response. tx=" + tx);
    }
    console.log("current gas price is ", parseInt(await utils.getGasPriceSync()) / 10 ** 9)
    console.log("sleep 15s");
    await utils.sleep(15 * 1000);
  }
}

var main = async function(){
  // wait for last tx
  let done_txs = done_list.split('\n');

  if (done_txs.length > 1){
    let cols = done_txs[done_txs.length-2].split(':');
    if (cols.length == 2){
      let tx = cols[1];
      await query_tx(tx);
    }
  }

  // start to send
  for(let i=0; i<to_accounts.length; i++){
    // get gas price
    while(true){
      var net_gas_price = parseInt(await utils.getGasPriceSync());
      if (net_gas_price > 10 ** 10){
        var gas_price = net_gas_price + 2 * (10 ** 9);
      } else {
        var gas_price = net_gas_price * 1.2;
      }
      console.log("use gas price at ", gas_price/(10 ** 9), "gw");
      if (gas_price <= config.gas_price * (10 ** 9)){
        break;
      } else if (gas_price <= 1.5 * config.gas_price * (10 ** 9)){
        console.log("gas_price is too high, try to use basic gas_price", config.gas_price, "gw");
        gas_price = config.gas_price * (10 ** 9);
        break;
      } else {
        console.log("gas_price is too high, wait");
        await utils.sleep(10 * 1000);
      }
    }

    // send transaction
    var tx;
    var tx_pending = true;
    let {err, result} = await sendSync(to_accounts[i]['address'], to_accounts[i]["amount"], from_account['address'], gas_price);
    if (!err){
      tx = result;
      fs.appendFileSync(__dirname + "/done_list.txt", to_accounts[i]['address'] + ":"+ tx + "\n")
      console.log(to_accounts[i]['address'], err, result);
    }
    else {
      fs.appendFileSync(__dirname + "/done_list.txt", to_accounts[i]['address'] + ":err" + "\n")
      console.log(to_accounts[i]['address'], "send error occurred");
      console.log("err", err);
      console.log("result", result);
      process.exit();
    }

    // query tx
    await utils.sleep(20 * 1000);
    console.log("sleep 20s. tx=" + tx);
    await query_tx(tx);
    console.log("next");
  }
  console.log("all is done");
}
main();
