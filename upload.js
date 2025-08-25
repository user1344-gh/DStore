const fs = require("fs");
const crypto = require("crypto")

function uploadData(name, data, password){
    const result = {
        success: false,
        error: "",
    }

    if (data.length == 0){
        result.error = "Missing data";
        return result;
    }
    if (password.length == 0){
        result.error = "Missing password";
        return result;
    } else if (password.length >= 32){
        result.error = "Password too long.";
        return result;
    }

    const encrypted = encryptData(data, password, password);

    const nameValidationResult = validate(name);
    if (nameValidationResult) {
        result.error = nameValidationResult;
        return result
    }

    if (fs.existsSync(`./datastore/${name}`)){
        result.error = "Name is used.";
        return result;
    }
   

    writeData(name, encrypted);

    result.success = true;
    return result;
}

function encryptData(data, key, iv){
    const key_hash = crypto.createHash("sha256").update(key).digest();
    const cipher = crypto.createCipheriv("aes-256-gcm", Buffer.from(key_hash), Buffer.from(iv));
    let ciphertext = Buffer.concat(
        [cipher.update(data, 'utf8'), cipher.final()]
    );
    const tag = cipher.getAuthTag();
    return Buffer.concat([ciphertext, tag]);
}

function validate(name){
    // Returns a string with information if failure, returns an empty one if the name passes.
    if (name.length == 0 || name.length >= 20){
        return "Name length must be between 1 and 20 characters";
    } else if (/^\.+$/.test(name)){
        return "Name cannot consist entirely of points.";
    } else if (/\/<>:"\\\|\?\*/.test(name)){
        return "Name cannot contain '/'"
    }
    return "";
}

function writeData(name, encryptedData){
    fs.writeFileSync(`./datastore/${name}`, encryptedData);
    return;
}

module.exports = {uploadData};
