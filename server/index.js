const express = require("express");
const {ec: EC} = require("elliptic");
const {Chain, Transaction} = require("./blockchain");

const PORT = process.env.PORT || 3001;

const app = express();

app.get("/api", (req, res) => {
    const {Chain, Transaction} = require('./blockchain');
    const EC = require('elliptic').ec;
    const curve = new EC('secp256k1');

    const myKey = curve.keyFromPrivate('9aae52b1e845413deaba402f883af9c57f545c9a528bd600e5d6be639270d6ea');
    const myAddress = myKey.getPublic('hex');

    let petCoin = new Chain();
    let firstTransation = new Transaction(myAddress, "Leva's public key", 10);
    firstTransation.sign(myKey);
    petCoin.addTransaction(firstTransation);

    petCoin.minePandingTransactions(myAddress);

    res.json({ message: JSON.stringify(petCoin.chain) });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});