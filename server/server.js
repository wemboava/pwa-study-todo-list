const http = require('http');
const PORT = 3005;

let DB = [];

function setItems(itemsList){
    if(!itemsList.length){
        itemsList = [itemsList];
    }
    itemsList.forEach(item => {
        if(!DB.find(DBItem => DBItem.id == item.id)){
            console.log(`Title: ${item.title}`);
            DB.push(item);
        }
    })
}

let server = http.createServer((req, res) => {
    res.writeHead('200', {
        'Content-Type':'application/json',
        "Access-Control-Allow-Origin": "*"
    });

    if(req.method === 'GET'){
        console.log('GET - List Items');
        res.write(JSON.stringify(DB));
        res.end();
    }else{
        console.log('POST - New Items');
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            var itemsList = JSON.parse(Buffer.concat(body).toString());
            setItems(itemsList);
            res.write(JSON.stringify(DB));
            res.end();
        });
    }
})

server.listen(PORT);
console.log(`Server on port ${PORT}`);