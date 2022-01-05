const {Chain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const curve = new EC('secp256k1');

const myKey = curve.keyFromPrivate('9aae52b1e845413deaba402f883af9c57f545c9a528bd600e5d6be639270d6ea');
const myAddress = myKey.getPublic('hex');

let petCoin = new Chain();
let firstTransation = new Transaction(myAddress, "Leva's public key", 10);
firstTransation.sign(myKey);
petCoin.addTransaction(firstTransation);

console.log("Mining started....")
//console.log(myAddress);
//onsole.log(petCoin)
petCoin.minePandingTransactions(myAddress);

console.log("my balance is", petCoin.getAddressBalance(myAddress));
console.log("is chain valid?", petCoin.isChainValid());