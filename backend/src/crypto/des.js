export default class DES {
    constructor() {
        // Initial Permutation Table
        this.IP = [
            58, 50, 42, 34, 26, 18, 10, 2,
            60, 52, 44, 36, 28, 20, 12, 4,
            62, 54, 46, 38, 30, 22, 14, 6,
            64, 56, 48, 40, 32, 24, 16, 8,
            57, 49, 41, 33, 25, 17, 9, 1,
            59, 51, 43, 35, 27, 19, 11, 3,
            61, 53, 45, 37, 29, 21, 13, 5,
            63, 55, 47, 39, 31, 23, 15, 7
        ];

        // Final Permutation Table
        this.FP = [
            40, 8, 48, 16, 56, 24, 64, 32,
            39, 7, 47, 15, 55, 23, 63, 31,
            38, 6, 46, 14, 54, 22, 62, 30,
            37, 5, 45, 13, 53, 21, 61, 29,
            36, 4, 44, 12, 52, 20, 60, 28,
            35, 3, 43, 11, 51, 19, 59, 27,
            34, 2, 42, 10, 50, 18, 58, 26,
            33, 1, 41, 9, 49, 17, 57, 25
        ];

        // Expansion table
        this.E = [
            32, 1, 2, 3, 4, 5,
            4, 5, 6, 7, 8, 9,
            8, 9, 10, 11, 12, 13,
            12, 13, 14, 15, 16, 17,
            16, 17, 18, 19, 20, 21,
            20, 21, 22, 23, 24, 25,
            24, 25, 26, 27, 28, 29,
            28, 29, 30, 31, 32, 1
        ];

        // S-boxes
        this.S = [
            // S1
            [
                [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
                [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
                [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
                [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
            ],
            // S2
            [
                [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
                [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
                [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
                [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
            ],
            // S3
            [
                [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
                [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
                [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
                [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
            ],
            // S4
            [
                [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
                [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
                [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
                [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
            ],
            // S5
            [
                [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
                [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
                [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
                [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
            ],
            // S6
            [
                [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
                [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
                [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
                [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
            ],
            // S7
            [
                [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
                [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
                [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
                [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
            ],
            // S8
            [
                [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
                [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
                [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
                [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
            ]
        ];

        // Permutation table
        this.P = [
            16, 7, 20, 21,
            29, 12, 28, 17,
            1, 15, 23, 26,
            5, 18, 31, 10,
            2, 8, 24, 14,
            32, 27, 3, 9,
            19, 13, 30, 6,
            22, 11, 4, 25
        ];

        // Key permutation table
        this.PC1 = [
            57, 49, 41, 33, 25, 17, 9,
            1, 58, 50, 42, 34, 26, 18,
            10, 2, 59, 51, 43, 35, 27,
            19, 11, 3, 60, 52, 44, 36,
            63, 55, 47, 39, 31, 23, 15,
            7, 62, 54, 46, 38, 30, 22,
            14, 6, 61, 53, 45, 37, 29,
            21, 13, 5, 28, 20, 12, 4
        ];

        // Key rotation schedule
        this.keyRotation = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

        // Key compression table
        this.PC2 = [
            14, 17, 11, 24, 1, 5,
            3, 28, 15, 6, 21, 10,
            23, 19, 12, 4, 26, 8,
            16, 7, 27, 20, 13, 2,
            41, 52, 31, 37, 47, 55,
            30, 40, 51, 45, 33, 48,
            44, 49, 39, 56, 34, 53,
            46, 42, 50, 36, 29, 32
        ];
    }

    // Convert string to binary
    stringToBinary(input) {
        let binary = '';
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i);
            let charBinary = charCode.toString(2);
            // Pad with leading zeros to make 8 bits
            while (charBinary.length < 8) {
                charBinary = '0' + charBinary;
            }
            binary += charBinary;
        }
        return binary;
    }

    // Convert binary to string
    binaryToString(binary) {
        let str = '';
        for (let i = 0; i < binary.length; i += 8) {
            const byte = binary.substr(i, 8);
            str += String.fromCharCode(parseInt(byte, 2));
        }
        return str;
    }

    // Convert binary to hexadecimal
    binaryToHex(binary) {
        let hex = '';
        for (let i = 0; i < binary.length; i += 4) {
            const nibble = binary.substr(i, 4);
            hex += parseInt(nibble, 2).toString(16);
        }
        return hex.toUpperCase();
    }

    // Convert hexadecimal to binary
    hexToBinary(hex) {
        let binary = '';
        for (let i = 0; i < hex.length; i++) {
            const nibble = parseInt(hex[i], 16).toString(2);
            binary += nibble.padStart(4, '0');
        }
        return binary;
    }

    // Permute bits according to given table
    permute(bits, table) {
        let result = '';
        for (let i = 0; i < table.length; i++) {
            result += bits[table[i] - 1];
        }
        return result;
    }

    // Left shift a string
    leftShift(str, shifts) {
        return str.substr(shifts) + str.substr(0, shifts);
    }

    // Generate 16 subkeys
    generateSubkeys(key) {
        // Convert key to binary if it's not already
        let keyBinary = key;
        if (key.length <= 8) { // Assuming it's a string
            keyBinary = this.stringToBinary(key);
        }

        // Ensure key is 64 bits (DES standard)
        if (keyBinary.length < 64) {
            // Pad with zeros if needed
            keyBinary = keyBinary.padEnd(64, '0');
        } else if (keyBinary.length > 64) {
            // Truncate if needed
            keyBinary = keyBinary.substr(0, 64);
        }

        // Apply PC1 permutation (64 bits -> 56 bits)
        const pc1Key = this.permute(keyBinary, this.PC1);

        // Split into left and right halves
        let C = pc1Key.substr(0, 28);
        let D = pc1Key.substr(28);

        const subkeys = [];

        // Generate 16 subkeys
        for (let i = 0; i < 16; i++) {
            // Left shift both halves
            C = this.leftShift(C, this.keyRotation[i]);
            D = this.leftShift(D, this.keyRotation[i]);

            // Combine and apply PC2 permutation (56 bits -> 48 bits)
            const combined = C + D;
            const subkey = this.permute(combined, this.PC2);
            subkeys.push(subkey);
        }

        return subkeys;
    }

    // XOR two binary strings
    xor(a, b) {
        let result = '';
        for (let i = 0; i < a.length; i++) {
            result += a[i] === b[i] ? '0' : '1';
        }
        return result;
    }

    // S-box substitution
    sBoxSubstitution(bits) {
        let result = '';
        for (let i = 0; i < 8; i++) {
            const chunk = bits.substr(i * 6, 6);
            const row = parseInt(chunk[0] + chunk[5], 2);
            const col = parseInt(chunk.substr(1, 4), 2);
            const val = this.S[i][row][col];
            result += val.toString(2).padStart(4, '0');
        }
        return result;
    }

    // Feistel function
    feistel(R, subkey) {
        // Expansion (32 bits -> 48 bits)
        const expanded = this.permute(R, this.E);

        // XOR with subkey
        const xored = this.xor(expanded, subkey);

        // S-box substitution (48 bits -> 32 bits)
        const substituted = this.sBoxSubstitution(xored);

        // Permutation
        const permuted = this.permute(substituted, this.P);

        return permuted;
    }

    // Process a 64-bit block
    processBlock(block, subkeys, encrypt = true) {
        // Initial permutation
        let permuted = this.permute(block, this.IP);

        // Split into left and right halves
        let L = permuted.substr(0, 32);
        let R = permuted.substr(32);

        // 16 rounds of Feistel network
        for (let i = 0; i < 16; i++) {
            const subkey = encrypt ? subkeys[i] : subkeys[15 - i];
            const temp = R;
            const feistelResult = this.feistel(R, subkey);
            R = this.xor(L, feistelResult);
            L = temp;
        }

        // Combine R and L (note the reverse order)
        const combined = R + L;

        // Final permutation
        const result = this.permute(combined, this.FP);

        return result;
    }

    // Pad the input to be a multiple of 64 bits (8 bytes)
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

    // Encrypt plaintext
    encrypt(plaintext, key) {
        // Generate subkeys
        const subkeys = this.generateSubkeys(key);

        // Pad the plaintext if needed
        const padded = this.padInput(plaintext);

        let ciphertext = '';

        // Process each 64-bit block
        for (let i = 0; i < padded.length; i += 8) {
            const block = padded.substr(i, 8);
            const binaryBlock = this.stringToBinary(block);
            const encryptedBlock = this.processBlock(binaryBlock, subkeys, true);
            ciphertext += encryptedBlock;
        }

        // Convert binary ciphertext to hexadecimal for easier handling
        return this.binaryToHex(ciphertext);
    }

    // Decrypt ciphertext
    decrypt(ciphertext, key) {
        // Generate subkeys
        const subkeys = this.generateSubkeys(key);

        // Convert hex ciphertext to binary
        const binaryCiphertext = this.hexToBinary(ciphertext);

        let plaintext = '';

        // Process each 64-bit block
        for (let i = 0; i < binaryCiphertext.length; i += 64) {
            const block = binaryCiphertext.substr(i, 64);
            const decryptedBlock = this.processBlock(block, subkeys, false);
            plaintext += this.binaryToString(decryptedBlock);
        }

        // Remove padding
        return this.removePadding(plaintext);
    }
}