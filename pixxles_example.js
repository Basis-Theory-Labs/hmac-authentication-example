const crypto = require("crypto");

function ksort(data) {
    // Compare keys as ascii strings
    var sorter = function (a, b) {
        return a > b ? 1 : a < b ? -1 : 0;
    };

    // Sort the data in ascending ascii key order
    var ret = {};
    var keys = Object.keys(data).sort(sorter);
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        ret[k] = data[k];
    }

    return ret;
}

function urlencode(str) {
    str = str + "";
    return encodeURIComponent(str)
        .replace(/!/g, "%21")
        .replace(/'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")
        .replace(/\*/g, "%2A")
        .replace(/~/g, "%7E")
        .replace(/%20/g, "+");
}

function http_build_query(data) {
    var build = function (key, val) {
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }

        if (val === null) {
            return "";
        } else if (typeof val === "object") {
            var k,
                tmp = [];
            for (k in val) {
                if (val[k] !== null) {
                    tmp.push(build(key + "[" + k + "]", val[k]));
                }
            }
            return tmp.join("&");
        } else if (typeof val !== "function") {
            return urlencode(key) + "=" + urlencode(val);
        } else {
            throw Error("There was an error processing for http_build_query().");
        }
    };

    var key,
        val,
        tmp,
        ret = [];

    for (key in data) {
        val = data[key];
        tmp = build(key, val);
        if (tmp !== "") {
            ret.push(tmp);
        }
    }

    return ret.join("&");
}

function sha512(str) {
    return crypto.createHash("sha512").update(str).digest("hex");
}

function sign(data, secret) {

    var ret = null;

    // Sort the data in ascending ascii key order
    data = ksort(data);

    // Convert to a URL encoded string
    ret = http_build_query(data);

    // Normalise all line endings (CRNL|NLCR|NL|CR) to just NL (%0A)
    ret = ret.replace(/%0D%0A|%0A%0D|%0D/gi, "%0A");

    // Hash the string and secret together
    ret = sha512(ret + secret);

    return ret;
}


const signature = sign({foo:"bar", bankID:"9876545"},"abc123");
console.log(signature);