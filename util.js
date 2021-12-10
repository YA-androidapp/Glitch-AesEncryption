const crypto = require('crypto')


// 暗号化
exports.encrypt = function(password, salt, plaintext) {
    const key = crypto.scryptSync(password, salt, 32)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

    const data = Buffer.from(plaintext)
    let encrypted = cipher.update(data)
    encrypted = Buffer.concat([encrypted, cipher.final()])

    return {iv, encrypted}
}


// 復号化
exports.decrypt = function(password, salt, iv, encrypted) {
    const key = crypto.scryptSync(password, salt, 32)
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)

    let decryptedData = decipher.update(encrypted)
    decryptedData =  Buffer.concat([decryptedData, decipher.final()])

    return decryptedData
}