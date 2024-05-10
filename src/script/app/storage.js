function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=None;Secure";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setStorage(data) {
    let oldData = getStorage();
    let result = { ...oldData, ...data };

    setCookie("storage", JSON.stringify(result), 356);
}

function getStorage() {
    let storageString = getCookie("storage");

    if (storageString === "" || storageString === " ")
        return {}
    else
        return JSON.parse(storageString)
}


document.addEventListener("readystatechange", () => {
    // only execute on ready
    if (document.readyState !== "complete") return;

    // init storage
    if (getStorage().todos === undefined) setStorage({todos: [], ...getStorage()});

    // load todos
    getStorage().todos?.forEach(todo => createTodo(todo.name, todo.description, todo.priority, todo.complete, todo.uuid))
})