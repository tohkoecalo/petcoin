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
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.timestampt + JSON.stringify(this.transaction) + this.nonce).toString();
    }

    mineBlock(difficultyOffset) {
        while (this.hash.substring(0, difficultyOffset) !== Array(difficultyOffset + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block " + this.index + " mined with hash: " + this.hash);
    }
}

class Chain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficultyOffset = 2;
    }

    createGenesisBlock() {
        return new Block(0, new Date(), "I am genesis block", "none");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addNewBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficultyOffset);
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            let tmp = currentBlock.calculateHash();
            if (currentBlock.hash !== tmp) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

let petCoin = new Chain();
let firstTransation = new Transaction("Leva", "Sasha", 100);
let secondTransaction = new Transaction("Sasha", "Leva", 50);

console.log("Mining block " + petCoin.chain.length + "...");
petCoin.addNewBlock(new Block(petCoin.chain.length, new Date(), firstTransation));

console.log("Mining block " + petCoin.chain.length + "...");
petCoin.addNewBlock(new Block(petCoin.chain.length, new Date(), secondTransaction));
