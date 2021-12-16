const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor (senderWallet, recieveWallet, amount) {
        this.timestampt = new Date();
        this.senderWallet = senderWallet;
        this.recieveWallet = recieveWallet;
        this.amount = amount;
    }
}

class Block {
    constructor(index, timestampt, transaction, previousHash = '') {
        this.index = index;
        this.timestampt = timestampt;
        this.transaction = transaction;
        this.hash = this.calculateHash();
        this.previousHash = previousHash;
    }

    calculateHash() {
        return SHA256(SHA256(this.index).toString() + SHA256(this.timestampt).toString() 
                + SHA256(JSON.stringify(this.transaction)).toString() + SHA256(this.hash).toString()).toString();
    }
}

class Chain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, new Date(), "I am genesis block", "none");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        let tmp = this.getLatestBlock().hash;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let petCoin = new Chain();
let firstTransation = new Transaction("Leva", "Sasha", 100);
let secondTransaction = new Transaction("Sasha", "Leva", 50);
petCoin.addNewBlock(new Block(petCoin.chain.length, new Date(), firstTransation));
petCoin.addNewBlock(new Block(petCoin.chain.length, new Date(), secondTransaction));

console.log(JSON.stringify(petCoin, null, 4));