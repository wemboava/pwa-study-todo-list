import { DB } from './toDoDB';
import { Template } from './toDoTemplate';
import { Controller } from './toDoController';

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service_worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope: ', registration.scope);
        })
        .catch((err) => {
            console.log('Service Worker registration failed: ', err);
        })
}



DB.start().then(db => {
    db.findAll().then( itemsList => Template.toDoList(itemsList) );
})

Controller.start();