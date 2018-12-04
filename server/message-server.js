const webpush = require('web-push');
const pushKeys = require('./push-keys');
const http = require('http');
const PORT = 3006;

let DB = [];

function sendNotification(message, subscription){
    return new Promise(resolve => {
        webpush.setVapidDetails(
            pushKeys.subject,
            pushKeys.publicKey,
            pushKeys.privatekey
        )

        webpush.sendNotification(subscription, message)
            .then(function(){
                console.log('message sent');
                resolve({'result': 'success'})
            })
            .catch(function(){
                console.log('message failed');
                resolve({'result': 'error'})
            })
    })
}

let server = http.createServer((req, res) => {
    res.writeHead('200', {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    })

    if(req.method === 'GET'){
        console.log('Sending Messages');
        Promise.all(
            DB.map(subscription => {
                return sendNotification('Hello from Server!!!', subscription)
            })
        ).then(() => {
            res.write(JSON.stringify({result: 'finish'}));
            res.end();
        })
    }
})

server.listen(PORT);
console.log(`Server on port ${PORT}`);