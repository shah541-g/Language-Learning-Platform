
import DES from "./des.js";

class TripleDES {
    constructor() {
        this.des = new DES();
    }

    // Pad the input to be a multiple of 8 bytes (64 bits)
    padInput(input) {
        const paddingLength = 8 - (input.length % 8);
        const paddingChar = String.fromCharCode(paddingLength);
        return input + paddingChar.repeat(paddingLength);
    }

    // Remove padding from the decrypted text
    removePadding(text) {
        const paddingLength = text.charCodeAt(text.length - 1);
        if (paddingLength > 0 && paddingLength <= 8) {
            return text.substr(0, text.length - paddingLength);
        }
        return text;
    }

    // Encrypt plaintext using Triple DES (EDE: Encrypt-Decrypt-Encrypt)
    encrypt(plaintext, key1, key2, key3 = key1) {
        // Pad the plaintext
        const padded = this.padInput(plaintext);

        // Step 1: DES encrypt with key1
        const firstPass = this.des.encrypt(padded, key1);

        // Step 2: DES decrypt with key2, treating firstPass as ciphertext
        const firstPassBinary = this.des.hexToBinary(firstPass);
        const secondPassBinary = this.des.processBlock(firstPassBinary, this.des.generateSubkeys(key2), false);

        // Step 3: DES encrypt with key3, treating secondPass as plaintext
        const finalPass = this.des.processBlock(secondPassBinary, this.des.generateSubkeys(key3), true);
        const finalPassHex = this.des.binaryToHex(finalPass);

        return finalPassHex;
    }

    // Decrypt ciphertext using Triple DES (EDE: Decrypt-Encrypt-Decrypt)
    decrypt(ciphertext, key1, key2, key3 = key1) {

        // Step 1: DES decrypt with key3
        const ciphertextBinary = this.des.hexToBinary(ciphertext);
        const firstPassBinary = this.des.processBlock(ciphertextBinary, this.des.generateSubkeys(key3), false);

        // Step 2: DES encrypt with key2
        const secondPassBinary = this.des.processBlock(firstPassBinary, this.des.generateSubkeys(key2), true);

        // Step 3: DES decrypt with key1
        const finalPassBinary = this.des.processBlock(secondPassBinary, this.des.generateSubkeys(key1), false);
        const finalPassText = this.des.binaryToString(finalPassBinary);

        // Remove padding
        const decrypted = this.removePadding(finalPassText);
        return decrypted;
    }
}


export default new TripleDES();