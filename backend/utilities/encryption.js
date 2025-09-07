const crypto = require('crypto');
// Set your secret key and IV (IV should be 16 bytes for AES-256-CBC)
const SECRET_KEY = "xza548sa3vcr641b5ng5nhy9mlo64r6k";
const IV_STRING = "5ng5nhy9mlo64r6k";
// Create 32-byte key from secret using SHA-256
const key = crypto.createHash('sha256').update(SECRET_KEY).digest();
const iv = Buffer.from(IV_STRING);

class encription {
    Response(res, message) {
    res.json(message);
    }
    // Encrypt function
    encryptPlain(text) {
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
    // Decrypt function
    decryptPlain(encryptedText) {
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }

}
module.exports = new encription();