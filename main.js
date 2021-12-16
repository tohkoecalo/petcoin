const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor (senderWallet, recieveWallet, amount) {
        this.senderWallet = senderWallet;
        this.recieveWallet = recieveWallet;
        this.amount = amount;
    }
}

class Block {
    constructor(timestampt, transactions, previousHash = '') {
        this.timestampt = timestampt;
        this.transactions = transactions;
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
        this.pandingTransactions = [];
        this.reward = 10;
    }

    createGenesisBlock() {
        return new Block(new Date(), "I am genesis block", "none");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePandingTransactions(miningRewardAddress) {
        let newBlock = new Block(new Date, this.pandingTransactions)
        newBlock.mineBlock(this.difficultyOffset);

        console.log("Block mined!");
        this.chain.push(newBlock);

        this.pandingTransactions = [
            new Transaction(null, miningRewardAddress, this.reward)
        ]
    }

    createTransaction(transaction) {
        this.pandingTransactions.push(transaction);
    }

    getAddressBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (address === trans.recieveWallet) {
                    balance += trans.amount;
                }

                if (address === trans.senderWallet) {
                    balance -= trans.amount;
                }
            }
        }

        return balance;
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
petCoin.createTransaction(firstTransation);
let secondTransaction = new Transaction("Sasha", "Leva", 50);
petCoin.createTransaction(secondTransaction);

console.log("Mining started....")
petCoin.minePandingTransactions("myself");

console.log("myself balance is", petCoin.getAddressBalance("myself"));

let thirdTransation = new Transaction("Leva", "Sasha", 100);
petCoin.createTransaction(thirdTransation);
let fourthTransaction = new Transaction("Sasha", "Leva", 50);
petCoin.createTransaction(fourthTransaction);

petCoin.minePandingTransactions("myself");
console.log("myself balance is", petCoin.getAddressBalance("myself"));
console.log("Leva balance is", petCoin.getAddressBalance("Leva"));
console.log("Sasha balance is", petCoin.getAddressBalance("Sasha"));


