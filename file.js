const fs = require("fs")

function validate(path){
    if (/\/\.+\//.test(`./pages/${path}`)){
        return false;
    }
    return true;
}

function process(path){
    const res = {
        exists: false,
        path: `./pages/${path}`
    }
    if (!validate(path)){return res;}
    if (!fs.existsSync(res.path)) {return res;}
    const fileStats = fs.statSync(res.path);
    if (fileStats.isFile()){
        res.path = fs.realpathSync(res.path)
        res.exists = true;
        return res
    }
    res.exists = fs.existsSync(`./pages/${path}/index.html`);
    res.path = fs.realpathSync(`./pages/${path}/index.html`);
    return res;
}


module.exports = {process}
