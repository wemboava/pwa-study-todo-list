export const Template = {
    toDoList(itemList){
        var listElement = document.querySelector('.todo-list');
        var template = '';
        itemList.forEach(item => {
            var backgroundImage = !item.image ? '' : `style="background-image: url('${item.image}');"`;
            var checkbox = item.isChecked ? 'check_box' : 'check_box_outline_blank';
            template += `<li class="todo-list-item">
			                <div class="demo-card-wide mdl-card mdl-shadow--2dp" ${backgroundImage} >
			                    <div class="card-content-container" >  
			                      <div class="mdl-card__title">
			                        <h2 class="mdl-card__title-text">${item.title}</h2>
			                      </div>
			                      <div class="mdl-card__supporting-text">
			                        ${item.description}
			                      </div>
			                      <div class="mdl-card__menu">
			                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-item="${item.id}" data-action="open" >
			                          <i class="material-icons">edit</i>
			                        </button>
			                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect" data-item="${item.id}" data-action="check" >
			                          <i class="material-icons">${checkbox}</i>
			                        </button>
			                      </div>
			                    </div>
			                </div>
			            </li>`;
        });
        listElement.innerHTML = template;
        return template;
    }
}