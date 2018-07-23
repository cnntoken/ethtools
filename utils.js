const config = require(__dirname + '/config');

const sleep = function(ms){
  return new Promise(resolve=>{
    setTimeout(resolve, ms);
  })
}

const getGasPriceSync = function() {
  return new Promise((resolve, reject)=>{
    config.web3.eth.getGasPrice().then(function(resp){
      resolve(resp);
    });
  })
}

const getNetGasPrice = async function() {
  var gas_price = config.gas_price * (10 ** 9);
  while(true){
    var net_gas_price = parseInt(await getGasPriceSync());
    console.log("gas price is ", net_gas_price/(10 ** 9), "gw");
    if (net_gas_price > 10 ** 10){
      gas_price = net_gas_price + 2 * (10 ** 9);
    } else {
      gas_price = net_gas_price * 1.2;
    }
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
  gas_price = parseInt(gas_price);
  console.log("use gas price at ", gas_price/(10 ** 9), "gw");
  return gas_price;
}

const getTransactionSync = function(tx){
  return new Promise((resolve,reject)=>{
    config.web3.eth.getTransaction(tx).then(function(resp){
        resolve(resp);
    });
  })
}

const getTokenBalanceSync = function(address){
  return new Promise(resolve=>{
    const cb = function(err, result){
      resolve({
        "err" : err,
        "result" : result
      });
    }
    try{
      config.contract.methods.balanceOf(address).call(cb);
    } catch (e){
      cb(e, null);
      resolve(resp);
    }
  });
}


var utils = {
  sleep: sleep,
  getGasPriceSync: getGasPriceSync,
  getTransactionSync: getTransactionSync,
  getTokenBalanceSync: getTokenBalanceSync,
  getNetGasPrice: getNetGasPrice,
}

module.exports = utils;
