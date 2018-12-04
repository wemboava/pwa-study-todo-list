import { DB } from './toDoDB';
import { Template } from './toDoTemplate';
import { Controller } from './toDoController';
import { ToDoNotification } from './toDoNotification';

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./service_worker.js')
        .then((registration) => {
            console.log('Service Worker registered with scope: ', registration.scope);
            ToDoNotification.subscribeUserToNotification();
        })
        .catch((err) => {
            console.log('Service Worker registration failed: ', err);
        })
}



DB.start().then(db => {
    db.findAll().then( itemsList => Template.toDoList(itemsList) );
})

Controller.start();


navigator.serviceWorker.addEventListener('message', function(event){
    if(event.data === 'updateScreens'){
        DB.findAll().then( itemsList => Template.toDoList(itemsList) );
    }
})