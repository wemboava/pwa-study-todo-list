var mockDB = [];

export const DB = {
    start(){
        return new Promise(resolve => {
            mockDB = [];
            resolve(this);
        })
    },
    selectedItem: {},
    find(id){
        return new Promise(resolve => {
            var item = mockDB.find(item => item.id == id);
            this.selectedItem = item;
            resolve(item);
        })
    },
    findAll(){
        return new Promise(resolve => {
            resolve(mockDB);
        })
    },
    insert(item){
        return new Promise(resolve => {
            item.id = (new Date()).getTime();
            item.isChecked = false;

            mockDB.push(item);
            resolve(this.findAll());
        })
    },
    update(item){
        return new Promise(resolve => {
            var selectedItem = mockDB.find(dbItem => dbItem.id == item.id),
                itemIndex = mockDB.indexOf(selectedItem);

            if(selectedItem){
                selectedItem = Object.assign(selectedItem, item);
                mockDB[itemIndex] = selectedItem;
            }

            resolve(this.findAll());
        })
    },
    remove(id){
        return new Promise(resolve => {
            var selectedItem = mockDB.find(dbItem => dbItem.id == id),
                itemIndex = mockDB.indexOf(selectedItem);

            if(selectedItem){
                mockDB.splice(index, 1);
            }

            resolve(this.findAll());
        })
    },
    checkAll(isChecked = false){
        return new Promise(resolve => {
            mockDB.map(item => {
                item.isChecked = isChecked;
                return item;
            })
            resolve(this.findAll());
        })
    },
    clearAll(){
        return new Promise(resolve => {
            var newDB = [];
            mockDB.forEach(item => {
                if(!item.isChecked){
                    newDB.push(item);
                }
            })
            mockDB = newDB;
            resolve(this.findAll());
        })
    }
}