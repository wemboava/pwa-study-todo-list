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

function setSubscription(subscription){
    var newKeys = JSON.stringify(subscription.keys);
    var foundSubscription = DB.find(subscription => JSON.stringify(subscription.keys) === newKeys);
    if(!foundSubscription){
        console.log('POSt - New User');
        DB.push(subscription);
    }
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
    }else{
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            var subscription = JSON.parse(Buffer.concat(body).toString());
            setSubscription(subscription);

            res.write(JSON.stringify(DB));
            res.end();
        })
    }
})


server.listen(PORT);
console.log(`Server on port ${PORT}`);