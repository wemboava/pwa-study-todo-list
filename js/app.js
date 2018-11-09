import { DB } from './toDoDB';
import { Template } from './toDoTemplate';
import { Controller } from './toDoController';


DB.start().then(db => {
    db.findAll().then( itemsList => Template.toDoList(itemsList) );
})

Controller.start();