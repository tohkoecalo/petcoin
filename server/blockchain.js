const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const curve = new EC('secp256k1');

class Transaction {
    constructor (senderWallet, recieveWallet, amount) {
        this.senderWallet = senderWallet;
        this.recieveWallet = recieveWallet;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.senderWallet + this.recieveWallet + this.amount).toString();
    }

    sign(keyPair) {
        if (keyPair.getPublic('hex') !== this.senderWallet) {
            throw new Error("Public key is not equals senderWallet");
        }
        const hash = this.calculateHash();
        const sign = keyPair.sign(hash, 'base64');
        this.signature = sign.toDER('hex');
    }

    isValid() {
        if (this.senderWallet === null) return true;

        if (!this.signature || this.signature.length === 0) {
            throw new Error("Transaction does not have a signature");
        }

        const pablicKey = curve.keyFromPublic(this.senderWallet, 'hex');
        return pablicKey.verify(this.calculateHash(), this.signature);
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

        console.log("Block mined with hash: " + this.hash);
        console.log("Block: " + JSON.stringify(this));
    }

    isInvalidBlock() {
        for (let tx of this.transactions) {
            if (!tx.isValid()) {
                return true;
            }
        }

        return false;
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
        let rewardTransaction = new Transaction(null, miningRewardAddress, this.reward);
        this.pandingTransactions.push(rewardTransaction);
        let newBlock = new Block(new Date(), this.pandingTransactions, this.getLatestBlock().hash)
        newBlock.mineBlock(this.difficultyOffset);

        console.log("Block mined!");
        this.chain.push(newBlock);

        this.pandingTransactions = [
            new Transaction(null, miningRewardAddress, this.reward)
        ]
    }

    addTransaction(transaction) {
        if (!transaction.senderWallet || !transaction.recieveWallet) {
            throw new Error("Transaction does not have sender or reciever");
        }

        if (!transaction.isValid()){
            throw new Error("Transaction is not valid");
        }

        this.pandingTransactions.push(transaction);
    }

    getAddressBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            console.log(block);
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

            if (currentBlock.isInvalidBlock()) {
                console.log("invalid block");
                return false;
            }
        
            let tmp = currentBlock.calculateHash();
            if (currentBlock.hash !== tmp) {
                console.log("invalid hash");
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("invalid prev hash");
                return false;
            }

            return true;
        }
    }
}

module.exports.Chain = Chain;
module.exports.Transaction = Transaction;