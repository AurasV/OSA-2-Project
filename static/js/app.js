// app.js

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

const toggleDarkMode = document.getElementById('toggle-dark-mode');
const darkModeIcon = document.getElementById('dark-mode-icon');

toggleDarkMode.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
        darkModeIcon.classList.add('text-yellow-300');
        toggleDarkMode.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        toggleDarkMode.classList.add('bg-gray-800', 'hover:bg-gray-700');
        setCookie('darkModeEnabled', 'true', 30);
    } else {
        darkModeIcon.classList.remove('fa-sun');
        darkModeIcon.classList.add('fa-moon');
        darkModeIcon.classList.remove('text-yellow-300');
        toggleDarkMode.classList.remove('bg-gray-800', 'hover:bg-gray-700');
        toggleDarkMode.classList.add('bg-gray-200', 'hover:bg-gray-300');
        setCookie('darkModeEnabled', 'false', -1);
    }
});

window.onload = function() {
    const darkModeEnabled = getCookie('darkModeEnabled');
    if (darkModeEnabled && darkModeEnabled === 'true') {
        document.body.classList.add('dark');
        darkModeIcon.classList.remove('fa-moon');
        darkModeIcon.classList.add('fa-sun');
        darkModeIcon.classList.add('text-yellow-300');
        toggleDarkMode.classList.remove('bg-gray-200', 'hover:bg-gray-300');
        toggleDarkMode.classList.add('bg-gray-800', 'hover:bg-gray-700');
    }
};
