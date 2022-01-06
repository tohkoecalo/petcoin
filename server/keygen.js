const EC = require('elliptic').ec;
const EC = require('elliptic').ec;
const curve = new EC('secp256k1');

const keyPair = curve.genKeyPair();
const certificate = keyPair.getPublic('hex');
const privateKey = keyPair.getPrivate('hex');

console.log("\nPublic key", certificate);
console.log("\nPrivate key", privateKey);
