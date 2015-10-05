var Practo = require("practo-api-client");
var config = require("config")


var pClient = new Practo({
    host: "https://api.practo.com", //Default
    client_id: config.practo.client_id,
    token: config.practo.token
});

module.exports = pClient;