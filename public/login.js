function reload() {
    window.location.reload();
}

function register() {
    alert('Te has registrado en nuestra página, ya puedes ingresar')
}

function back() {
    setTimeout(() => {
        window.location.href = './';
    }, 2000);
}
function backNow() {
    window.location.href = './';
}