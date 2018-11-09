


export const Controller = {
    start(){
        document.addEventListener('click', (event) => {
            if(event.target.classList.contains('mdl-button__ripple-container') || event.target.classList.contains('material-icons')){
                var button = event.target.parentElement;
                switch (button.dataset['action']){
                    case 'open': this.Modal.item.open(button.dataset['item']) ;break;
                    case 'close': this.Modal.item.close() ;break;
                    case 'check': this.Modal.item.check(button.dataset['item']) ;break;
                    case 'save': this.Modal.item.save() ;break;
                    case 'startCamera': this.Modal.camera.open() ;break;
                    case 'stopCamera': this.Modal.camera.close() ;break;
                    case 'shoot': this.Modal.camera.shoot() ;break;
                    case 'changeSource': this.Modal.camera.changeSource() ;break;
                }
            }else if(event.target.classList.contains('mdl-navigation__link')){
                var button = event.target;
                switch (button.dataset['action']){
                    case 'newItem': this.Menu.newItem() ;break;
                    case 'checkAll': this.Menu.checkAll() ;break;
                    case 'uncheckAll': this.Menu.uncheckAll() ;break;
                    case 'clearAll': this.Menu.clearAll() ;break;
                }
            }
        })
    },
    Modal: {
        item: {
            modal: document.querySelector('#item-dialog'),
            selectedItemId: null,
            open(itemId){

            },
            close(){

            },
            setItem(itemId){

            },
            check(itemId){

            },
            save(item){

            },
            getElements(){

            },
            getItemValues(){

            }
        },
        camera:{
            modal: document.querySelector('#camera-dialog'),
            open(){

            },
            close(){

            },
            shoot(){

            },
            changeSource(){

            }
        }
    },
    Menu: {
        newItem(){

        },
        checkAll(){

        },
        uncheckAll(){

        },
        clearAll(){

        },
        closeMenu(){

        }
    }
}