const SERVER_URL = 'http://localhost:3005/';

let request,
    db;

function getObjectStore(){
    return db.transaction(['ToDoItems'], 'readwrite').objectStore('ToDoItems');
}

function getAll(){
    return fetch(SERVER_URL).then(response => response.json());
}

function postAll(obj){
    return fetch(SERVER_URL, {
        'method': 'POST',
        'Content-Type': 'application/json',
        'body': JSON.stringify(obj)
    })
        .then(response => response.json())
        .then(items => {
            navigator.serviceWorker.controller.postMessage('updateScreens');
            return items;
        })
}

export const DB = {
    getAll, postAll,
    start(){
        return new Promise(resolve => {
            request = indexedDB.open('toDo', 1);
            request.onsuccess = (event) => {
                db = request.result;
                resolve(this);
            }

            request.onupgradeneeded = (event) => {
                db = event.target.result;
                db.createObjectStore('ToDoItems', { keyPath: 'id' });
            }
        })
    },
    get request(){ return request; },
    get db(){ return db; },
    selectedItem: {},
    find(id){
        return new Promise(resolve => {
            var request = getObjectStore().get(+id);
            request.onsuccess = (event) => {
                this.selectedItem = request.result;
                resolve(request.result);
            }
        })
    },
    findAll(location = 'server'){
        return new Promise(resolve => {
            if(navigator.onLine && location === 'server'){
                resolve(getAll());
            }else{
                var request = getObjectStore().getAll();
                request.onsuccess = (event) => {
                    resolve(request.result);
                }
            }
        })
    },
    insert(item){
        return new Promise(resolve => {
            item.id = (new Date()).getTime();
            item.isChecked = false;

            if(navigator.onLine){
                resolve(postAll(item));
            }else{
                var request = getObjectStore().add(item);
                request.onsuccess = (event) => {
                    resolve(this.findAll())

                    navigator.serviceWorker.ready.then(function(registration){
                        return registration.sync.register('newItem');
                    })
                }
            }
        })
    },
    update(item){
        return new Promise(resolve => {
            var updatedItem = Object.assign(this.selectedItem, item);
            var request = getObjectStore().put(updatedItem);
            request.onsuccess = (event) => { resolve(this.findAll()) }
        })
    },
    remove(id){
        return new Promise(resolve => {
            var request = getObjectStore().delete(id);
            request.onsuccess = (event) => { resolve(this.findAll()) }
        })
    },
    checkAll(isChecked = false){
        var isAllUpdated = false,
            isUpdated = false;
        return new Promise(resolve => {
            getObjectStore().openCursor().onsuccess = (event) => {
                var cursor = event.target.result;
                if(cursor){
                    isUpdated = false;
                    var newData = cursor.value;
                    newData.isChecked = isChecked;
                    var request = cursor.update(newData);
                    request.onsuccess = () => {
                        isUpdated = true;
                        if(isAllUpdated && isUpdated){
                            resolve(this.findAll());
                        }
                    }
                    cursor.continue();
                }else{
                    isAllUpdated = true;
                    if(isAllUpdated && isUpdated){
                        resolve(this.findAll());
                    }
                }
            }
        })
    },
    clearAll(){
        var isAllRemoved = false,
            isRemoved = false;
        return new Promise(resolve => {
            getObjectStore().openCursor().onsuccess = (event) => {
                var cursor = event.target.result;
                if(cursor){
                    isRemoved = false;
                    if(cursor.value.isChecked){
                        var request = cursor.delete();
                        request.onsuccess = () => {
                            isRemoved = true;
                            if(isAllRemoved && isRemoved){
                                resolve(this.findAll());
                            }
                        }
                    }else{
                        isRemoved = true;
                    }
                    cursor.continue();
                }else{
                    isAllRemoved = true;
                    if(isAllRemoved && isRemoved){
                        resolve(this.findAll());
                    }
                }
            }
        })
    }
}