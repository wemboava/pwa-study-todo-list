var webpush = require('web-push');
var fs = require('fs');
var vapidKeys = webpush.generateVAPIDKeys();
var myEmail = 'your@email.com';

var pushKeysContents = `module.exports = {
    subject: "mailto:${myEmail}",
    publicKey: "${vapidKeys.publicKey}",
    privatekey: "${vapidKeys.privateKey}"
}`;

var pushKeysFilePath = __dirname + '/push-keys.js';

fs.writeFile(pushKeysFilePath, pushKeysContents, function(err){
    if (err) {
        console.log('Erro ao criar o arquivo push-keys.js');
        console.log(err);
    } else {
        console.log(pushKeysFilePath + ' criado!');
    }
})