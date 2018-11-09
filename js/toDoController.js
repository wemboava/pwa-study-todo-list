import { Template } from './toDoTemplate';
import { DB } from './toDoDB';
import { Camera } from './camera';


export const Controller = {
    start(){
        document.addEventListener('click', (event)=> {
            if(event.target.classList.contains('mdl-button__ripple-container') || event.target.classList.contains('material-icons')){
                var button = event.target.parentElement;
                switch(button.dataset['action']){
                    case 'open': this.Modal.item.open(button.dataset['item']); break;
                    case 'close': this.Modal.item.close(); break;
                    case 'check': this.Modal.item.check(button.dataset['item']); break;
                    case 'save': this.Modal.item.save(); break;
                    case 'startCamera': this.Modal.camera.open(); break;
                    case 'stopCamera': this.Modal.camera.close(); break;
                    case 'shoot': this.Modal.camera.shoot(); break;
                    case 'changeSource': this.Modal.camera.changeSource(); break;
                }
            }else if(event.target.classList.contains('mdl-navigation__link')){
                var button = event.target;
                switch(button.dataset['action']){
                    case 'newItem': this.Menu.newItem(); break;
                    case 'checkAll': this.Menu.checkAll(); break;
                    case 'uncheckAll': this.Menu.uncheckAll(); break;
                    case 'clearAll': this.Menu.clearAll(); break;
                }
            }
        })
    },
    Modal: {
        item: {
            modal: document.querySelector('#item-dialog'),
            selectedItemId: null,
            open(itemId){
                var dialog = this.modal;
                dialog.querySelector('.close').addEventListener('click', this.close);
                dialog.showModal();
                this.setItem(itemId);
                this.selectedItemId = itemId;
            },
            close(){
                var that = Controller.Modal.item;
                var dialog = that.modal;
                dialog.querySelector('.close').removeEventListener('click', that.close);
                dialog.hasAttribute('open') && dialog.close();
            },
            setItem(itemId){
                var form = this.getElements();
                if(!itemId){
                    form.img.src = '';
                    form.title.value = '';
                    form.description.value = '';
                }else{
                    DB.find(itemId).then(item => {
                        form.img.src = item.image || '';
                        form.title.value = item.title;
                        form.description.value = item.description;
                    })
                }
            },
            check(itemId){
                this.selectedItemId = itemId;
                DB.find(itemId).then(item => {
                    item.isChecked = !item.isChecked;
                    this.save(item);
                })
            },
            save(item){
                var itemValues = item || this.getItemValues();
                (this.selectedItemId ? DB.update(itemValues) : DB.insert(itemValues))
                    .then(itemsList => {
                        Template.toDoList(itemsList);
                        this.close();
                    })
            },
            getElements(){
                var dialog = this.modal;
                var img = dialog.querySelector('#item-dialog-picture'),
                    title = dialog.querySelector('#title'),
                    description = dialog.querySelector('#description');
                return {img, title, description};
            },
            getItemValues(){
                var form = this.getElements();
                return {title: form.title.value, description: form.description.value, image: form.img.getAttribute('src')};
            }
        },
        camera: {
            modal: document.querySelector('#camera-dialog'),
            open(){
                var dialog = this.modal;
                dialog.querySelector('.close').addEventListener('click', this.close);
                dialog.showModal();
                Camera.start();
            },
            close(){
                var that = Controller.Modal.camera;
                var dialog = that.modal;
                dialog.querySelector('.close').removeEventListener('click', that.close);
                dialog.hasAttribute('open') && dialog.close();
                Camera.stop();
            },
            shoot(){
                var image = Camera.shoot();
                if(image){
                    Controller.Modal.item.getElements().img.src = image;
                    this.close();
                }
            },
            changeSource(){
                Camera.changeSource();
            }
        }
    },
    Menu: {
        newItem(){
            Controller.Modal.item.open();
            this.closeMenu();
        },
        checkAll(){
            DB.checkAll(true).then(itemsList => {
                Template.toDoList(itemsList);
            })
        },
        uncheckAll(){
            DB.checkAll(false).then(itemsList => {
                Template.toDoList(itemsList);
            })
        },
        clearAll(){
            DB.clearAll().then(itemsList => {
                Template.toDoList(itemsList);
            })
            this.closeMenu();
        },
        closeMenu(){
            document.querySelector('.mdl-layout__obfuscator').click();
        }
    }
}