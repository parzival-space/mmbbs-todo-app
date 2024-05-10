
function handleTodoStateChanged(e) {
    e.parentElement.parentElement.setAttribute('state', e.checked ? 'completed' : '')

    // update remaining count
    let todosAll = document.querySelectorAll(".todos ul li");
    let todosCompleted = document.querySelectorAll('.todos ul li[state="completed"]');
    let remainingTextElem = document.querySelector('.header .title span');
    remainingTextElem.innerText = `${todosAll.length - todosCompleted.length} remaining`

    sortTodos()
}

function sortTodos() {
    // Select the list items
    const todos = document.querySelectorAll('.todos ul li');

    // Convert NodeList to Array for easier manipulation
    const todosArray = Array.from(todos);

    // Separate completed and incomplete todos
    const completedTodos = todosArray.filter(todo => todo.querySelector('.checkbox input').checked);
    const incompleteTodos = todosArray.filter(todo => !todo.querySelector('.checkbox input').checked);

    // Sort the incomplete todos by priority, completed state, and name
    incompleteTodos.sort((a, b) => {
        const priorityA = parseInt(a.querySelector('.priority').textContent);
        const priorityB = parseInt(b.querySelector('.priority').textContent);
        if (priorityA !== priorityB) return priorityB - priorityA;

        const completedA = a.querySelector('.checkbox input').checked;
        const completedB = b.querySelector('.checkbox input').checked;
        if (completedA !== completedB) return completedA ? 1 : -1;

        const nameA = a.querySelector('.details h1').textContent.toLowerCase();
        const nameB = b.querySelector('.details h1').textContent.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    // Clear the list
    todos.forEach(todo => todo.remove());

    // Append the sorted incomplete todos first
    incompleteTodos.forEach(todo => document.querySelector('.todos ul').appendChild(todo));

    // Append the completed todos last
    completedTodos.forEach(todo => document.querySelector('.todos ul').appendChild(todo));
}

function createTodo(title, description, priority, completed, uuid) {
    // Create a new list item element
    const listItem = document.createElement('li');
    listItem.setAttribute('state', completed ? 'completed' : 'incomplete');
    listItem.setAttribute('uuid', uuid)

    // Create the checkbox input element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.onchange = () => {
        let storage = getStorage();
        let todoIndex = storage.todos.findIndex(x => x.uuid === uuid);
        storage.todos[todoIndex].complete = checkbox.checked;
        setStorage(storage);

        handleTodoStateChanged(checkbox)
    };

    // Create the checkbox label element
    const checkboxLabel = document.createElement('label');
    checkboxLabel.className = 'checkbox';
    checkboxLabel.appendChild(checkbox);

    // Create the checkmark span element
    const checkmarkSpan = document.createElement('span');
    checkmarkSpan.className = 'checkmark';
    checkmarkSpan.innerHTML = `
        <i class="fa-regular fa-square"></i>
        <i class="fa-regular fa-square-check"></i>
    `;

    // Append the checkmark span to the checkbox label
    checkboxLabel.appendChild(checkmarkSpan);

    // Create the details div element
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'details';

    // Create the h1 element for the title
    const titleHeading = document.createElement('h1');
    titleHeading.textContent = title;

    // Create the p element for the description
    const descriptionParagraph = document.createElement('p');
    descriptionParagraph.textContent = description;

    // Append the title and description to the details div
    detailsDiv.appendChild(titleHeading);
    detailsDiv.appendChild(descriptionParagraph);

    // Create the priority text
    const priorityText = document.createElement('span');
    priorityText.className = 'priority';
    priorityText.innerText = priority;

    // Create the edit button element
    const editButton = document.createElement('button');
    editButton.className = 'editBtn';
    editButton.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';
    editButton.onclick = () => {
        let inputName = document.querySelector('.menu form input[name="name"]')
        inputName.value = title;

        let inputDescription = document.querySelector('.menu form input[name="description"]')
        inputDescription.value = description;

        let inputPriority = document.querySelector('.menu form input[name="priority"]')
        inputPriority.value = priority;

        let menu = document.querySelector(".menu");
        menu.setAttribute("mode", "edit");
        menu.setAttribute("uuid", uuid);
        menu.setAttribute("state", "shown");
    }

    // Append the checkbox label, details div, and edit button to the list item
    listItem.appendChild(checkboxLabel);
    listItem.appendChild(detailsDiv);
    listItem.appendChild(priorityText);
    listItem.appendChild(editButton);

    // Append the new todo to the list
    document.querySelector('ul').appendChild(listItem);
}