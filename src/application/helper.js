const Crypto = require("crypto");

function hashingMD5(username, command) {
  const hash = Crypto.createHash("md5")
    .update(`${username}${process.env.KEY}${command}`)
    .digest("hex");
  return hash;
}

function hashingHmacSHA1(data, key) {
  const hashHmac = Crypto.createHmac("sha1", key).update(data).digest("hex");
  return hashHmac;
}

function currentDate() {
  return new Date().toISOString().replace("T", " ").substring(0, 19);
}

module.exports = { hashingMD5, hashingHmacSHA1, currentDate };
