const fs = require("fs");
const crypto = require("crypto");

function retrieveData(name, password){
    const result = {
        data: null,
        error: null,
        status: 200,
    }

    if (!fs.existsSync(`./datastore/${name}`)){
        result.error = "File doesn't exist";
        result.status = 404;
        return result;
    }
    const encrypted = fs.readFileSync(`./datastore/${name}`)
    let data;
    try{
        data = decryptData(encrypted, password, password);
    } catch(err){
        result.status = 403;
        result.error = "Incorrect filename or password";
        return result
    }

    result.data = data

    return result
}

function decryptData(encrypted, key, iv){ 
    const tag = encrypted.subarray(-16);
    const key_hash = crypto.createHash("sha256").update(key).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key_hash), Buffer.from(iv));
    decipher.setAuthTag(tag);
    let data = Buffer.concat([decipher.update(encrypted.subarray(0, -16)), decipher.final()]);
    return data.toString();
}

module.exports = {retrieveData};
