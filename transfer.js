const config = require(__dirname + '/config');
const accounts = require(__dirname + '/accounts');
const utls = require(__dirname + '/utils');
const BigNumber = require('bignumber.js')

// 转Token
function send(address, amount, from_address, gas_price, callback){
  try{
    config.contract.methods.transfer(address, new BigNumber(amount * 10 ** 18)).send({from: from_address, gas:config.gas_amount, gasPrice: gas_price.toString()}, callback);
  } catch (e){
    callback(e, null);
  }
}
function sendSync(address, amount, from_address, gas_price){
  return new Promise(resolve=>{
    const cb = function(err, result){
      resolve({
        "err" : err,
        "result" : result
      });
    }
    try{
      send(address, amount, from_address, gas_price, cb);
    } catch (e){
      cb(e, null);
  }});
}



module.exports = sendSync;
