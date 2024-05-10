const urlParams = new URLSearchParams(window.location.search);
window.data = {
    username: urlParams.get("username") ?? "mmustermann",
    password: urlParams.get("password") ?? "password"
};