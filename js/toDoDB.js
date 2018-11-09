let request,
    db;

function getObjectStore(){
    return db.transaction(['ToDoItems'], 'readwrite').objectStore('ToDoItems');
}

export const DB = {
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
    findAll(){
        return new Promise(resolve => {
            var request = getObjectStore().getAll();
            request.onsuccess = (event) => {
                resolve(request.result);
            }
        })
    },
    insert(item){
        return new Promise(resolve => {
            item.id = (new Date()).getTime();
            item.isChecked = false;

            var request = getObjectStore().add(item);
            request.onsuccess = (event) => {
                resolve(this.findAll())
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